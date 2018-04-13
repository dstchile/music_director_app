# cordova-plugin-node
This plugin provides access to some native functionality using the [Node+ Platform](http://www.variableinc.com/#!node1/c1g5n) developed by [Variable, Inc.](http://www.variableinc.com/) via a global `node` object.

This plugin is being built apart from a separate AngularJS Module that I am also developing that will use this Cordova Plugin; it may be found at [cjschooley/ng-node](https://github.com/cjschooley/ng-node) (NYI).

## Contributing
I know that I cannot be the only developer out there who wants to use Variable's Node+ Platform using Cordova; if you would like to contribute, open issues or offer suggestions, that'd be awesomesauce. :)

As I am developing this for my employer, there are a couple modules taking the forefront (Therma and Thermocouple), but I do intend on building this beyond those two; again, contributions welcome.

## Supported Platforms
* Android
* iOS

## Installation
```
cordova plugin add https://github.com/cjschooley/cordova-plugin-node.git
```

You may also install the plugin via the NPM Registry, but it is not recommended at this time; NPM strips out all Symbolic Links upon publishing thus screwing with the iOS Framework copied within this repository. Please see Cordova Issue [CB-6092](https://issues.apache.org/jira/browse/CB-6092); linked therein, also, NPM Issue [3310](https://github.com/npm/npm/issues/3310).
```
cordova plugin add cordova-plugin-node
```

I will continue to maintain the package there as well regardless.

## Methods
* `node.connect`
* `node.disconnect`
* `node.requestBatteryLevel`
* `node.setStreamMode`
* `node.setStreamModeThermocouple`

### node.connect
Connect to a Node+ Device.

```javascript
node.connect(options, success, failure);
```

#### Example
```javascript
node.connect(
  {
    address: 'AA:BB:CC:11:22:33', // Required; MAC Address or UUID for Android and iOS respectively
    batteryListener: true,        // Optional; listen for low/critical battery (see Events); defaults true
    buttonListener: true,         // Optional; listen for button to be pushed and released (see Events); defaults true
    disconnectListener: true      // Optional; listen for the node to disconnect (see Events); defaults true
  },
  function(result) {alert('We connected to your Node!')},
  function(error) {alert('Unfortunately, we were unable to connect to your Node.')}
)
```

### node.disconnect
Disconnect from currently-connected Node+ Device.

```javascript
node.disconnect(success, failure);
```

#### Example
```javascript
node.disconnect(
  function(result) {alert('We disconnected from your Node!')},
  function(error) {alert('Really!? An error occurred as we were attempting to disconnect your Node? How absurd.')}
)
```

### node.requestBatteryLevel
Request that the Node update its Battery Level and return the percentage to your `success` callback.

```javascript
node.requestBatteryLevel(success, failure);
```

#### Success Result
```json
{
  "percent": 75,
  "volts": 4.075123
}
```

#### Example
```javascript
node.requestBatteryLevel(
  function(result) {alert('Your Node is currently at '+result.percent+'%.')}, // Alerts "Your Node is currently at 75%." with above result.
  function(error) {alert('Hmmm...')}
)
```

### node.setStreamMode
Allows the developer to set the stream mode of the Therma (Infrared) Module. In addition to the standard `options`, `success` and `failure` parameters, we may provide a `stream` callback. When enabling, the `success` callback simply signifies that you were successful in enabling the Therma Module; when disabling, the `success` callback will contain the last result that the `stream` callback passed (or would've passed if you chose to not provide a `stream` callback).

```javascript
node.setStreamMode(options, success, failure, stream);
```

#### Success and Stream Result
```json
{
  "event": "onTemperatureReading",
  "sensor": "therma",
  "celsius": 23.969995,
  "fahrenheit": 75.14599609375
}
```

#### Example
```javascript
// Enabling the Therma Module
node.setStreamMode(
  {
    irMode: true,   // Optional; Enable or Disable the Therma Module with `true` or `false` respectively; defaults `false`
    ledMode: true   // Optional; Enable or Disable the LED Leads on the Therma Module with `true` or `false` respectively; defaults `false`
  },
  function(result) {alert('Your Therma Module has been enabled.')},         // `result` will be `undefined`.
  function(error) {alert('We were unable to enable the Therma Module.')},
  function(stream) {console.log(stream.fahrenheit)}                         // Will log the `75.14599609375` with above result; please note: this will trigger rapidly.
);

// Disabling the Therma Module
node.setStreamMode(
  {},               // Required; the keys are optional, not the parameter
  function(result) {alert('The surface temperature of the portrait on the wall is '+Math.round(result.fahrenheit)+'°F.')},  // Alerts "The surface temperature of the portrait on the wall is 75°F." with above result.
  function(error) {alert('Well, we apparently failed at turning off this sensor...')}
  // Notice the complete lack of a `stream` callback; completely optional - even when we enable the sensor.
)
```

### node.setStreamModeThermocouple
Allows the developer to set the stream mode of the Thermocouple (Probe) Module. In addition to the standard `options`, `success` and `failure` parameters, we may provide a `stream` callback. When enabling, the `success` callback simply signifies that you were successful in enabling the Thermocouple Module; when disabling, the `success` callback will contain the last result that the `stream` callback passed (or would've passed if you chose to not provide a `stream` callback).

```javascript
node.setStreamModeThermocouple(options, success, failure, stream);
```

#### Success and Stream Result
```json
{
  "event": "onThermoCoupleReading",
  "sensor": "thermocouple",
  "celsius": 23.969995,
  "fahrenheit": 75.14599609375
}
```

#### Example
```javascript
// Enabling the Thermocouple Module
node.setStreamModeThermocouple(
  {
    enabled: true,  // Optional; Enable or Disable the Thermocouple Module with `true` or `false` respectively; defaults `false`
    period: 10,     // Optional; The period between readings in units of 10ms (period * 10ms); defaults 0
    lifetime: 0     // Optional; The number of readings to collect; defaults 0 (infinite)
  },
  function(result) {alert('Your Thermocouple Module has been enabled.')},       // `result` will be `undefined`.
  function(error) {alert('We were unable to enable the Thermocouple Module.')},
  function(stream) {console.log(stream.fahrenheit)}                             // Will log the `75.14599609375` with above result; please note: this will trigger rapidly.
);

// Disabling the Thermocouple Module
node.setStreamModeThermocouple(
  {},               // Required; the keys are optional, not the parameter
  function(result) {alert('The core liver temperature is '+Math.round(result.fahrenheit)+'°F.')},  // Alerts "The score liver temperature is 75°F." with above result.
  function(error) {alert('Well, we apparently failed at turning off this sensor; keep probing that liver!')}
  // Notice the complete lack of a `stream` callback; completely optional - even when we enable the sensor.
)
```

## Events
* `node-battery-status`
* `node-battery-low`
* `node-battery-critical`
* `node-button-pushed`
* `node-button-released`
* `node-disconnected`

### node-battery-status
Event dispatched when the connected Node+ Device's Battery Level changes from the current level.

#### Example
```javascript
window.addEventListener("node-battery-status", function(battery) {
  alert("Battery at "+battery.percent+"% capacity.");
});
```

### node-battery-low
Event dispatched when the connected Node+ Device's Battery Level dips below 30%. (This will be made configurable at some point.)

#### Example
```javascript
window.addEventListener("node-battery-low", function(battery) {
  alert("I dare say good sir or madam; it would seem that your Node's battery strength is weakening; presently it rests at "+battery.percent+"%.");
});
```

### node-battery-critical
Event dispatched when the connected Node+ Device's Battery Level dips below 10%. (This will be made configurable at some point.)

#### Example
```javascript
window.addEventListener("node-battery-critical", function(battery) {
  alert("Hehe, you Node is at "+battery.percent+"%; you better get your Node plugged into something right away...");
});
```

### node-button-pushed
Event dispatched when the connected Node+ Device's Button is pushed. Currently, no additional data is passed along with the event.

#### Example
```javascript
window.addEventListener("node-button-pushed", function() {
  alert("You make me pulse my lights when you push my button! Love, Node");
});
```

### node-button-released
Event dispatched when the connected Node+ Device's Button is released. Currently, no additional data is passed along with the event.

#### Example
```javascript
window.addEventListener("node-button-released", function() {
  alert("You got bored? Why'd you release my button?");
});
```

### node-disconnected
Event dispatched when the connected Node+ Device disconnects. Currently, no additional data is passed along with the event.

#### Example
```javascript
window.addEventListener("node-disconnected", function() {
  alert("Sorry, but we lost your Node.");
});
```
