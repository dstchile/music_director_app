package com.gleasontech.cordova.plugins;

import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothAdapter;
import android.content.Context;

import java.util.ArrayList;
import android.util.Log;

// import com.variable.application.NodeApplication;
import com.variable.framework.android.bluetooth.BluetoothService;
import com.variable.framework.android.bluetooth.DefaultBluetoothDevice;
import com.variable.framework.dispatcher.DefaultNotifier;
import com.variable.framework.node.AndroidNodeDevice;
import com.variable.framework.node.BaseSensor;
import com.variable.framework.node.NodeDevice;
import com.variable.framework.node.ThermaSensor;
import com.variable.framework.node.ThermocoupleSensor;
import com.variable.framework.node.reading.SensorReading;
import com.variable.framework.node.enums.NodeEnums;
import com.variable.framework.node.enums.NodeEnums.ModuleLocation;
import com.variable.framework.node.interfaces.ProgressUpdateListener;

import static com.variable.framework.node.NodeDevice.ConnectionListener;


import org.apache.cordova.CordovaWebView;
import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaArgs;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.LOG;
import org.apache.cordova.PluginResult;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;


import java.util.Set;
import java.text.DecimalFormat;


import android.os.Bundle;
import android.os.Handler;
import android.os.Message;

import android.app.Activity;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothGattCharacteristic;
import android.bluetooth.BluetoothManager;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Handler;

import java.util.*;


public class Node extends CordovaPlugin implements NodeDevice.ButtonListener,
                                                   NodeDevice.ConnectionListener,
                                                   NodeDevice.StatusListener,
                                                   ThermaSensor.ThermaListener,
                                                   ThermocoupleSensor.ThermaCoupleListener {

  private Context context;
  private CallbackContext callbackContext;

  /* "On-Demand" Callback Context Variables */
  private CallbackContext connectionCallbackContext;
  private CallbackContext requestBatteryLevelCallbackContext;
  private CallbackContext listenForButtonPushReleaseCallbackContext;
  private CallbackContext listenForDisconnectCallbackContext;
  private CallbackContext listenForThermaReadingCallbackContext;
  private CallbackContext listenForThermocoupleReadingCallbackContext;

  // private NodeApplication app = new NodeApplication();
  private NodeDevice node = null;
  private ThermaSensor therma;
  private ThermocoupleSensor thermocouple;

  private BluetoothAdapter bluetoothAdapter = BluetoothAdapter.getDefaultAdapter();
  private BluetoothDevice bluetoothDevice = null;
  private BluetoothService bluetoothService = new BluetoothService();

  /* I hate floats... */
  private Float batteryLevel = 0.2f;
  private Float temperatureReading = 0.2f;

  private String TAG = "com.gleasontech.cordova.plugins.Node";

  /**
   * Constructor.
   */
  public Node() {}

  /**
   * Sets the context of the Command. This can then be used to do things like
   * get file paths associated with the Activity.
   *
   * @param cordova The context of the main Activity.
   * @param webView The CordovaWebView Cordova is running in.
   */
  public void initialize(CordovaInterface cordova, CordovaWebView webView) {
    super.initialize(cordova, webView);
    // this.context = this.cordova.getActivity().getApplicationContext();
    // app.initialize(this.context);
  }

  /**
   * Executes the request and returns PluginResult.
   *
   * @param action            The action to execute.
   * @param args              JSONArry of arguments for the plugin.
   * @param callbackContext   The callback id used when calling back into JavaScript.
   * @return                  True if the action was valid, false if not.
   */
  public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
    // Log.i(TAG, "execute("+action+", , callbackContext)");

    // if (context == null) {context = this.cordova.getActivity().getApplicationContext();}
    // if (!app.isInitialized()) {app.initialize(context);}

    boolean validAction = true;
    this.callbackContext = callbackContext;

    if (action.equals("connect")) {this.connect(callbackContext, args); validAction = true;}
    else if (action.equals("disconnect")) {this.disconnect(callbackContext); validAction = true;}
    else if (action.equals("getDetails")) {this.getDetails(callbackContext); validAction = true;}

    else if (action.equals("setStreamMode")) {this.setStreamMode(callbackContext, args); validAction = true;}
    else if (action.equals("setStreamModeThermocouple")) {this.setStreamModeThermocouple(callbackContext, args); validAction = true;}

    else if (action.equals("requestBatteryLevel")) {this.requestBatteryLevel(callbackContext); validAction = true;}
    else if (action.equals("listenForButtonPushRelease")) {this.listenForButtonPushRelease(callbackContext); validAction = true;}
    else if (action.equals("listenForDisconnect")) {this.listenForDisconnect(callbackContext); validAction = true;}
    else if (action.equals("listenForThermaReading")) {this.listenForThermaReading(callbackContext); validAction = true;}
    else if (action.equals("listenForThermocoupleReading")) {this.listenForThermocoupleReading(callbackContext); validAction = true;}

    else {validAction = false;}

    return validAction;
  }

  /**
   * Attempts to connect to the Node+ Device using the provided MAC Address.
   *
   * Please Note: a successful `PluginResult.Status.OK` does not signify a
   * successful connection; it is simply an indication that the attempt was
   * performed. To receive a successful connection, please see the
   * override for `onCommunicationInitCompleted(NodeDevice)`.
   *
   * @param callbackContext   The callback id used when calling back into JavaScript.
   * @param args              JSONArry of arguments for the plugin; should contain the MAC Address at index 0.
   */
  private void connect(final CallbackContext callbackContext, JSONArray args) {
    try {
      // TODO: Are we already connected to a node device?
      String address = args.getString(0);
      bluetoothDevice = bluetoothAdapter.getRemoteDevice(address);
      node = AndroidNodeDevice.getOrCreateNodeFromBluetoothDevice(bluetoothDevice, new DefaultBluetoothDevice(bluetoothService));
      node.connect();

      // TODO: Do we already have listeners?
      DefaultNotifier.instance().addButtonListener(this);
      DefaultNotifier.instance().addConnectionListener(this);
      DefaultNotifier.instance().addStatusListener(this);

      connectionCallbackContext = callbackContext;
    }
    catch(Exception e) {
      callbackContext.error(e.getMessage());
    }
  }

  // TODO: this need documented.
  private void pushConnectionStatus(String status, Boolean success) {
    if (connectionCallbackContext != null) {
      try {
        JSONObject listener = new JSONObject();
        listener.put("status", status);
        listener.put("success", success);
        // TODO: is there a better method to go about this?
        PluginResult result = null;
        if (success) {result = new PluginResult(PluginResult.Status.OK, listener);}
        else {result = new PluginResult(PluginResult.Status.ERROR, listener);}
        result.setKeepCallback(false);
        connectionCallbackContext.sendPluginResult(result);
      }
      catch(Exception e) {
        PluginResult result = new PluginResult(PluginResult.Status.ERROR, e.getMessage());
        result.setKeepCallback(false);
        connectionCallbackContext.sendPluginResult(result);
      }
    }
  }

  // TODO: this need documented.
  private void pushConnectionStatus(String status, Boolean success, String message) {
    if (connectionCallbackContext != null) {
      try {
        JSONObject listener = new JSONObject();
        listener.put("status", status);
        listener.put("success", success);
        listener.put("message", message);
        // TODO: is there a better method to go about this?
        PluginResult result = null;
        if (success) {result = new PluginResult(PluginResult.Status.OK, listener);}
        else {result = new PluginResult(PluginResult.Status.ERROR, listener);}
        result.setKeepCallback(false);
        connectionCallbackContext.sendPluginResult(result);
      }
      catch(Exception e) {
        PluginResult result = new PluginResult(PluginResult.Status.ERROR, e.getMessage());
        result.setKeepCallback(false);
        connectionCallbackContext.sendPluginResult(result);
      }
    }
  }

  /**
   * Attempts to disconnect from the currently connected Node+ Device.
   *
   * Please Note: a successful `PluginResult.Status.OK` does not signify a
   * successful disconnection; it is simply an indication that the attempt was
   * performed. To receive a successful disconnection, please see the
   * override for `onDisconnect(NodeDevice)`.
   *
   * @param callbackContext   The callback id used when calling back into JavaScript.
   */
  private void disconnect(final CallbackContext callbackContext) {
    try {
      // TODO: Do we even have a defined node object?
      // TODO: Is that node object even connected?
      node.disconnect();

      listenForDisconnectCallbackContext = callbackContext;
    }
    catch(Exception e) {
      callbackContext.error(e.getMessage());
    }
  }

  /**
   * Gather various details regarding the connected Node+ Device and pass them
   * back through the provided CallbackContext.
   *
   * @param callbackContext   The callback id used when calling back into JavaScript.
   */
  public void getDetails(CallbackContext callbackContext) {
    JSONObject device = new JSONObject();
    try {
      // TODO: Do we even have a defined node object?
      // TODO: Is that node object even connected?
      this.batteryLevel = node.getBatteryLevel();

      device.put("name", node.getName());
      device.put("model", node.getModel());
      device.put("id", node.getAddress());
      device.put("uuid", "");
      device.put("serial", node.getMotionSensor().getSerialNumber());
      device.put("batteryVolts", this.batteryLevel);
      device.put("firmware", node.getFirmwareVersion());
      device.put("signal", node.getSignalStrength());
      device.put("moduleA", node.getSensorOnPortA().getModuleType().name());
      device.put("moduleASerial", node.getSensorOnPortA().getSerialNumber());
      device.put("moduleB", node.getSensorOnPortB().getModuleType().name());
      device.put("moduleBSerial", node.getSensorOnPortB().getSerialNumber());

      PluginResult result = new PluginResult(PluginResult.Status.OK, device);
      callbackContext.sendPluginResult(result);
    }
    catch(Exception e) {
      callbackContext.error(e.getMessage());
    }
  }

  /**
   * Set the Stream Mode of the attached Therma Module, i.e., turn the Infrared
   * end off and on.
   *
   * Please Note: a successful `PluginResult.Status.OK` does not signify a
   * successful set; it is simply an indication that the attempt was
   * performed. To receive a successful read, please see the override for
   * `onTemperatureReading(ThermaSensor, SensorReading<Float>)`.
   *
   * @param callbackContext   The callback id used when calling back into JavaScript.
   * @param args              JSONArry of arguments for the plugin.
   */
  public void setStreamMode(final CallbackContext callbackContext, JSONArray args) {
    // TODO: Do we even have a defined node object?
    // TODO: Is that node object even connected?
    // TODO: Do we have a therma sensor?
    try {
      boolean irMode = args.getBoolean(0);
      boolean ledMode = args.getBoolean(1);

      // TODO: Do we already have listeners?
      DefaultNotifier.instance().addThermaListener(this);

      therma.setStreamMode(irMode, ledMode);

      callbackContext.success();
    }
    catch(Exception e) {
      callbackContext.error(e.getMessage());
    }
  }

  /**
   * Set the Stream Mode of the attached Thermocouple Module, i.e., turn the
   * Probe end off and on.
   *
   * Please Note: a successful `PluginResult.Status.OK` does not signify a
   * successful set; it is simply an indication that the attempt was
   * performed. To receive a successful read, please see the override for
   * `onTemperatureReading(ThermocoupleSensor, SensorReading<Float>)`.
   *
   * @param callbackContext   The callback id used when calling back into JavaScript.
   * @param args              JSONArry of arguments for the plugin.
   */
  public void setStreamModeThermocouple(final CallbackContext callbackContext, JSONArray args) {
    // TODO: Do we even have a defined node object?
    // TODO: Is that node object even connected?
    // TODO: Do we have a thermocouple sensor?
    try {
      boolean enabled = args.getBoolean(0);
      int period = args.getInt(1);
      int lifetime = args.getInt(2);

      // TODO: Do we already have listeners?
      DefaultNotifier.instance().addThermaCoupleListener(this);

      thermocouple.setStreamModeThermocouple(enabled, period, lifetime);

      callbackContext.success();
    }
    catch(Exception e) {
      callbackContext.error(e.getMessage());
    }
  }

  /**
   * Request that the Node+ Device provide an updated Battery Level.
   *
   * Please Note: unlike the other functions that simply perform a function and
   * then rely on completely separate Listener Handlers to fulfill the
   * requirements, this function specifically waits for a response to be
   * received before calling back.
   *
   * @param callbackContext   The callback id used when calling back into JavaScript.
   */
  public void requestBatteryLevel(final CallbackContext callbackContext) {
    // TODO: Do we even have a defined node object?
    // TODO: Is that node object even connected?
    requestBatteryLevelCallbackContext = callbackContext;
    node.requestBatteryLevel();
  }

  private void pushBatteryLevel() {
    this.batteryLevel = node.getBatteryLevel();

    if (requestBatteryLevelCallbackContext != null) {
      try {
        JSONObject listener = new JSONObject();
        listener.put("volts", this.batteryLevel);

        PluginResult result = new PluginResult(PluginResult.Status.OK, listener);
        result.setKeepCallback(true);
        requestBatteryLevelCallbackContext.sendPluginResult(result);
      }
      catch(Exception e) {
        PluginResult result = new PluginResult(PluginResult.Status.ERROR, e.getMessage());
        result.setKeepCallback(true);
        requestBatteryLevelCallbackContext.sendPluginResult(result);
      }
    }
  }

  /**
   * Listen for the Node+ Device to have its button pushed and released.
   *
   * @param callbackContext   The callback id used when calling back into JavaScript.
   */
  public void listenForButtonPushRelease(final CallbackContext callbackContext) {
    // TODO: Do we even have a defined node object?
    // TODO: Is that node object even connected?
    listenForButtonPushReleaseCallbackContext = callbackContext;
  }

  // TODO: this need documented.
  // TODO: should this function name be changed?
  private void pushButtonPushRelease(String event) {
    if (listenForButtonPushReleaseCallbackContext != null) {
      try {
        JSONObject listener = new JSONObject();
        listener.put("event", event);

        PluginResult result = new PluginResult(PluginResult.Status.OK, listener);
        result.setKeepCallback(true);
        listenForButtonPushReleaseCallbackContext.sendPluginResult(result);
      }
      catch(Exception e) {
        PluginResult result = new PluginResult(PluginResult.Status.ERROR, e.getMessage());
        result.setKeepCallback(true);
        listenForButtonPushReleaseCallbackContext.sendPluginResult(result);
      }
    }
  }

  /**
   * Listen for the Node+ Device to disconnect; preventive measure.
   *
   * @param callbackContext   The callback id used when calling back into JavaScript.
   */
  public void listenForDisconnect(final CallbackContext callbackContext) {
    // TODO: Do we even have a defined node object?
    // TODO: Is that node object even connected?
    listenForDisconnectCallbackContext = callbackContext;
  }

  // TODO: this need documented.
  private void pushDisconnect() {
    if (listenForDisconnectCallbackContext != null) {
      try {
        PluginResult result = new PluginResult(PluginResult.Status.OK);
        result.setKeepCallback(false);
        listenForDisconnectCallbackContext.sendPluginResult(result);
      }
      catch(Exception e) {
        PluginResult result = new PluginResult(PluginResult.Status.ERROR, e.getMessage());
        result.setKeepCallback(false);
        listenForDisconnectCallbackContext.sendPluginResult(result);
      }
    }
  }

  /**
   * Listen for the Node+ Device to disconnect; preventive measure.
   *
   * @param callbackContext   The callback id used when calling back into JavaScript.
   */
  public void listenForThermaReading(final CallbackContext callbackContext) {
    // TODO: Do we even have a defined node object?
    // TODO: Is that node object even connected?
    listenForThermaReadingCallbackContext = callbackContext;
  }

    // TODO: this need documented.
  private void pushThermaReading(String event, Float reading) {
    this.temperatureReading = reading;

    if (listenForThermaReadingCallbackContext != null) {
      try {
        JSONObject listener = new JSONObject();
        listener.put("event", event);
        listener.put("sensor", "therma");
        listener.put("celsius", this.temperatureReading);
        listener.put("fahrenheit", (((this.temperatureReading) * 1.8f) + 32));

        PluginResult result = new PluginResult(PluginResult.Status.OK, listener);
        result.setKeepCallback(true);
        listenForThermaReadingCallbackContext.sendPluginResult(result);
      }
      catch(Exception e) {
        PluginResult result = new PluginResult(PluginResult.Status.ERROR, e.getMessage());
        result.setKeepCallback(true);
        listenForThermaReadingCallbackContext.sendPluginResult(result);
      }
    }
  }

  /**
   * Listen for the Node+ Device to disconnect; preventive measure.
   *
   * @param callbackContext   The callback id used when calling back into JavaScript.
   */
  public void listenForThermocoupleReading(final CallbackContext callbackContext) {
    // TODO: Do we even have a defined node object?
    // TODO: Is that node object even connected?
    listenForThermocoupleReadingCallbackContext = callbackContext;
  }

    // TODO: this need documented.
  private void pushThermocoupleReading(String event, Float reading) {
    this.temperatureReading = reading;

    if (listenForThermocoupleReadingCallbackContext != null) {
      try {
        JSONObject listener = new JSONObject();
        listener.put("event", event);
        listener.put("sensor", "thermocouple");
        listener.put("celsius", this.temperatureReading);
        listener.put("fahrenheit", (((this.temperatureReading) * 1.8f) + 32));

        PluginResult result = new PluginResult(PluginResult.Status.OK, listener);
        result.setKeepCallback(true);
        listenForThermocoupleReadingCallbackContext.sendPluginResult(result);
      }
      catch(Exception e) {
        PluginResult result = new PluginResult(PluginResult.Status.ERROR, e.getMessage());
        result.setKeepCallback(true);
        listenForThermocoupleReadingCallbackContext.sendPluginResult(result);
      }
    }
  }


  /****************************************************************************/
  /******* Interface Overrides ************************************************/
  /****************************************************************************/
  // TODO: Document Listener Overrides
  // NOTE: These essentially just redirect functions that do stuff.


  /******* Therma Listener Override *******************************************/
  @Override
  public void onTemperatureReading(ThermaSensor sensor, SensorReading<Float> reading) {
    pushThermaReading("onTemperatureReading", reading.getValue());
  }
  /****************************************************************************/


  /******* Thermocouple Listener Override *************************************/
  @Override
  public void onThermoCoupleReading(ThermocoupleSensor sensor, SensorReading<Float> reading) {
    pushThermocoupleReading("onThermoCoupleReading", reading.getValue());
  }
  /****************************************************************************/


  /******* Button Listener Override *******************************************/
  @Override
  public void onPushed(NodeDevice node) {
    pushButtonPushRelease("pushed");
  }

  @Override
  public void onReleased(NodeDevice node) {
    pushButtonPushRelease("released");
  }
  /****************************************************************************/


  /******* Connectivity Listener Overrides ************************************/
  @Override
  public void onCommunicationInitCompleted(NodeDevice node) {
    pushConnectionStatus("onCommunicationInitCompleted", true);

    // TODO: should this be done here?
    this.therma = node.findSensor(NodeEnums.ModuleType.THERMA);
    this.thermocouple = node.findSensor(NodeEnums.ModuleType.THERMOCOUPLE);
  }

  @Override
  public void onConnected(NodeDevice node) {
    // Q: Why do we not `pushConnectionStatus(status, success);` here?
    // A: Because I have found MANY A TIME when the Node+ Device will connect
    //    and not successfully initiate and not throw a disconnect either.
  }

  @Override
  public void onDisconnect(NodeDevice node) {
    pushConnectionStatus("onDisconnect", false);
    pushDisconnect();

    // TODO: should this be done here?
    this.therma = null;
    this.thermocouple = null;
  }

  @Override
  public void onConnectionFailed(NodeDevice node, Exception e) {
    pushConnectionStatus("onConnectionFailed", false, e.getMessage());
  }

  @Override
  public void onNodeDiscovered(NodeDevice node) {

  }

  @Override
  public void onPairingFailure(NodeDevice node) {
    // Never actually seen this happen; regardless, it has the word `Failure` in
    // its name.
    pushConnectionStatus("onPairingFailure", false);
  }

  @Override
  public void nodeDeviceFailedToInit(NodeDevice node) {
    pushConnectionStatus("nodeDeviceFailedToInit", false);
  }

  @Override
  public void onInitializationUpdate(String update) {

  }

  @Override
  public void onConnecting(NodeDevice node) {

  }
  /****************************************************************************/


  /******* Status Listener Overrides ******************************************/
  @Override
  public void onModelReceived(NodeDevice node) {

  }

  @Override
  public void onFirmwareUpdateRequired(NodeDevice node) {

  }

  @Override
  public void onFirmwareVersionReceived(NodeDevice node) {

  }

  /** @deprecated */
  @Override
  public void onSerialsReceived(NodeDevice node, ModuleLocation location) {

  }

  @Override
  public void onBatteryLevelUpdate(NodeDevice node) {
    pushBatteryLevel();
  }

  /** @deprecated */
  @Override
  public void onModulesUpdate(NodeDevice node) {

  }

  /** @deprecated */
  @Override
  public void onSubModulesUpdate(NodeDevice node) {

  }

  @Override
  public void onQuietModeUpdated(NodeDevice node) {

  }

  /** @deprecated */
  @Override
  public void onModuleVersionsUpdated(NodeDevice node) {

  }
  /****************************************************************************/
}
