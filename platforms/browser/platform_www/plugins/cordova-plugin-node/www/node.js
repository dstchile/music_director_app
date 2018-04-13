cordova.define("cordova-plugin-node.node", function(require, exports, module) { /*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
 */

var argscheck = require('cordova/argscheck'),
    cordova = require('cordova'),
    exec = require('cordova/exec');

// These will be configurable someday.
var NODE_BATTERY_LEVEL_CRITICAL = 10;
var NODE_BATTERY_LEVEL_LOW = 30;
var NODE_BATTERY_UPDATE_INTERVAL = 60 * 1000;
// TODO: verify these voltages
// TODO: all nodes have same voltage battery?
var NODE_BATTERY_VOLTS_FULL = 4.2;
var NODE_BATTERY_VOLTS_EMPTY = 3.7;
var NODE_BATTERY_VOLTS_DIFFERENCE = NODE_BATTERY_VOLTS_FULL - NODE_BATTERY_VOLTS_EMPTY; // The functional range of the battery.

/**
 * @constructor
 */
var Node = function() {
  this._batteryPercent = null;
  this._batteryVolts = null;
  this._thermaResult = null;
  this._thermocoupleResult = null;

  this._batteryLevelRequestInterval = null;
};

/**
 * Request the current battery level of the connected Node device.
 *
 * @param {Function} success
 * @param {Function} failure
 */
Node.prototype.requestBatteryLevel = function(success, failure) {
  exec(success, failure, "Node", "requestBatteryLevel", []);
};

/**
 * Add a javascript interval that will periodically call `requestBatteryLevel`.
 */
Node.prototype._addNodeBatteryListener = function() {
  node._batteryLevelRequestInterval = setInterval(function() {
    node.requestBatteryLevel(node._batteryListener, node._error);
  }, NODE_BATTERY_UPDATE_INTERVAL);
};

/**
 * Clear out the javascript interval watching the battery level.
 */
Node.prototype._clearNodeBatteryListener = function() {
  clearInterval(node._batteryLevelRequestInterval);
  // TODO: Give this separate call to set the callback context to null
  exec(null, null, "Node", "requestBatteryLevel", []);
};

/**
 * Handle the battery level provided by the native portion of code; if it is
 * Low or Critical, dispatch an event to be caught by the app.
 *
 * @param {Object} update
 */
Node.prototype._batteryListener = function(update) {
  // TODO: yes, it IS possible for the percentage to be greater than 100%; batteries can do that...
  update.percent = Math.round(((update.volts - NODE_BATTERY_VOLTS_EMPTY) / NODE_BATTERY_VOLTS_DIFFERENCE) * 100);
  if (update) {
    if (node._batteryPercent !== update.percent) {
      if (node._batteryPercent > NODE_BATTERY_LEVEL_CRITICAL && update.percent <= NODE_BATTERY_LEVEL_CRITICAL) {
        cordova.fireWindowEvent("node-battery-critical", update);
      }
      else if (node._batteryPercent > NODE_BATTERY_LEVEL_LOW && update.percent <= NODE_BATTERY_LEVEL_LOW) {
        cordova.fireWindowEvent("node-battery-low", update);
      }
      else {
        cordova.fireWindowEvent("node-battery-status", update);
      }

      node._batteryPercent = update.percent;
      node._batteryVolts = update.volts;
    }
  }
};

/**
 * Log the error received.
 */
Node.prototype._error = function(error) {console.log(error);};

/**
 * Add a listener that will throw an event should the connected node have its
 * button pushed or released.
 */
Node.prototype._addNodeButtonListener = function() {
  exec(node._buttonListener, node._error, "Node", "listenForButtonPushRelease", []);
};

/**
 * Clear out the listener for node button push and release.
 */
Node.prototype._clearNodeButtonListener = function() {
  // TODO: Give this separate call to set the callback context to null
  exec(null, null, "Node", "listenForButtonPushRelease", []);
};

/**
 * Handle the node being disconnected.
 *
 * @param {Object} update
 */
Node.prototype._buttonListener = function(button) {
  cordova.fireWindowEvent("node-button-"+button.event);
};

/**
 * Connect to the Node+ Device specified within the supplied `options` param.
 *
 * @todo handle whether an address is supplied.
 *
 * @param {Object} options
 * @param {Function} success
 * @param {Function} failure
 */
Node.prototype.connect = function(options, success, failure) {
  options = options || {};
  var getValue = argscheck.getValue;

  var address = getValue(options.address, '');
  var batteryListener = getValue(options.batteryListener, true);
  var buttonListener = getValue(options.buttonListener, true);
  var disconnectListener = getValue(options.disconnectListener, true);

  var args = [address];

  var successWrapper = function() {
    if (success) success();
    if (batteryListener)    node._addNodeBatteryListener();
    if (buttonListener)     node._addNodeButtonListener();
    if (disconnectListener) node._addNodeDisconnectListener();
  };

  exec(successWrapper, failure, "Node", "connect", args);
};

/**
 * Disconnect the currently connected Node+ Device.
 *
 * @param {Function} success
 * @param {Function} failure
 */
Node.prototype.disconnect = function(success, failure) {
  var successWrapper = function() {
    if (success) success();
    node._clearNodeDisconnectListener();
    node._clearNodeButtonListener();
    node._clearNodeBatteryListener();
  };

  exec(successWrapper, failure, "Node", "disconnect", []);
};

/**
 * Add a listener that will throw an event should the connected node disconnect
 * for any reason.
 */
Node.prototype._addNodeDisconnectListener = function() {
  exec(node._disconnectListener, node._error, "Node", "listenForDisconnect", []);
};

/**
 * Clear out the listener for node disconnect.
 */
Node.prototype._clearNodeDisconnectListener = function() {
  // TODO: Give this separate call to set the callback context to null
  exec(null, null, "Node", "listenForDisconnect", []);
};

/**
 * Handle the node being disconnected.
 *
 * @param {Object} update
 */
Node.prototype._disconnectListener = function() {
  cordova.fireWindowEvent("node-disconnected");
};

/**
 * Get details pertaining to the currently connected Node+ Device.
 *
 * @param {Function} success
 * @param {Function} failure
 */
Node.prototype.getDetails = function(success, failure) {
  var successWrapper = function(details) {
    details.batteryPercent = Math.round(((details.batteryVolts - NODE_BATTERY_VOLTS_EMPTY) / NODE_BATTERY_VOLTS_DIFFERENCE) * 100);
    success(details);
  };
  // TODO: make this affect the Node Object rather than simply return.
  exec(successWrapper, failure, "Node", "getDetails", []);
};


/**
 * Set the Therma Module Stream Mode, i.e., turn the Infrared Module off and on.
 *
 * @param {Object} options
 * @param {Function} success
 * @param {Function} failure
 */
Node.prototype.setStreamMode = function(options, success, failure, stream) {
  options = options || {};
  var getValue = argscheck.getValue;

  var irMode = getValue(options.irMode, false);
  var ledMode = getValue(options.ledMode, false);

  var args = [irMode, ledMode];

  var successWrapper = function() {
    if (!irMode && node._thermaResult) {
      if (success) success(node._thermaResult);
      node._thermaResult = null;
    }
    else {
      if (success) success();
    }
  };

  var streamWrapper = function(result) {
    node._thermaResult = result;
    if (stream) stream(result);
  };

  exec(streamWrapper, node._error, "Node", "listenForThermaReading", []);
  exec(successWrapper, failure, "Node", "setStreamMode", args);
};

/**
 * Set the Thermocouple Module Stream Mode, i.e., turn the Probe Module off and
 * on.
 *
 * @param {Object} options
 * @param {Function} success
 * @param {Function} failure
 */
Node.prototype.setStreamModeThermocouple = function(options, success, failure, stream) {
  options = options || {};
  var getValue = argscheck.getValue;

  var enabled = getValue(options.enabled, false);
  var period = getValue(options.period, 0);
  var lifetime = getValue(options.lifetime, 0);

  var args = [enabled, period, lifetime];

  var successWrapper = function() {
    if (!enabled && node._thermocoupleResult) {
      if (success) success(node._thermocoupleResult);
      node._thermocoupleResult = null;
    }
    else {
      if (success) success();
    }
  };

  var streamWrapper = function(result) {
    node._thermocoupleResult = result;
    if (stream) stream(result);
  };

  exec(streamWrapper, node._error, "Node", "listenForThermocoupleReading", []);
  exec(successWrapper, failure, "Node", "setStreamModeThermocouple", args);
};

var node = new Node();

module.exports = node;

});
