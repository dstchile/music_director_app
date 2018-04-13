#import "CDVNode.h"
#import <Cordova/CDV.h>

#import "sqlite3.h"

@interface CDVNode()
- (CBPeripheral *)findPeripheralByUUID:(NSString *)uuid;
@end

@implementation CDVNode

@synthesize manager;

- (void)pluginInitialize {

  [super pluginInitialize];

  manager = [[CBCentralManager alloc] initWithDelegate:self queue:nil];

  connectionCallbackContext = nil;
  requestBatteryLevelCallbackContext = nil;
  listenForButtonPushReleaseCallbackContext = nil;
  listenForDisconnectCallbackContext = nil;
  listenForThermaReadingCallbackContext = nil;
  listenForThermocoupleReadingCallbackContext = nil;
}

#pragma mark - Cordova Plugin Methods

// TODO: this needs documented
- (void)connect:(CDVInvokedUrlCommand *)command {
  NSString *uuid = [command.arguments objectAtIndex:0];
  CBPeripheral *peripheral = [self findPeripheralByUUID:uuid];

  if (peripheral) {
    [manager connectPeripheral:peripheral options:nil];

    self.selectedNodeDevice = [[VTNodeDevice alloc] initWithDelegate:self withDevice:peripheral];
    self.selectedNodeDeviceUUID = uuid;

    connectionCallbackContext = [command.callbackId copy];
  } else {
    NSString *error = [NSString stringWithFormat:@"Could not find peripheral %@.", uuid];
    CDVPluginResult *pluginResult = nil;
    pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:error];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
  }
}

// TODO: this needs documented
- (void)disconnect:(CDVInvokedUrlCommand*)command {
  NSString *uuid = self.selectedNodeDeviceUUID;
  CBPeripheral *peripheral = [self findPeripheralByUUID:uuid];

  if (peripheral && peripheral.state != CBPeripheralStateDisconnected) {
    [manager cancelPeripheralConnection:peripheral];

    listenForDisconnectCallbackContext = [command.callbackId copy];
  }
  else {
    NSString *error = [NSString stringWithFormat:@"Peripheral %@ not connected.", uuid];
    CDVPluginResult *pluginResult = nil;
    pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:error];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
  }
}

// TODO: this needs documented
// TODO: actually return this data...
- (void)getDetails:(CDVInvokedUrlCommand*)command {
  NSString *moduleA = @"";
  NSString *moduleB = @"";

  switch ([self.selectedNodeDevice module_a_type]) {
      case VTNodeModuleTypeTherma:
          moduleA = @"Therma";
          break;
      case VTNodeModuleTypeThermocouple:
          moduleA = @"Thermocouple";
          break;
      default:
          break;
  }

  switch ([self.selectedNodeDevice module_b_type]) {
      case VTNodeModuleTypeTherma:
          moduleB = @"Therma";
          break;
      case VTNodeModuleTypeThermocouple:
          moduleB = @"Thermocouple";
          break;
      default:
          break;
  }

  NSMutableDictionary *peripheral = [NSMutableDictionary
    dictionaryWithDictionary:@{
      //  @"name" : [self.selectedNodeDevice name],
      @"model" : [self.selectedNodeDevice model],
      @"id" : self.selectedNodeDeviceUUID,
      @"serial" : [self.selectedNodeDevice serialNumber],
      @"batteryVolts": [NSNumber numberWithFloat:[self.selectedNodeDevice batteryLevel]],
      // @"firmware" : [NSString stringWithFormat: @"%@.%@", [NSString stringWithUTF8String:(char *)[self.selectedNodeDevice firmwareMajorRev]], [NSString stringWithUTF8String:(char *)[self.selectedNodeDevice firmwareMinorRev]]],
      @"signal" : @"",
      @"moduleA" : moduleA,
      @"moduleASerial" : [self.selectedNodeDevice moduleASerial],
      @"moduleB" : moduleB,
      @"moduleBSerial" : [self.selectedNodeDevice moduleBSerial]
    }
  ];

  CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:peripheral];
  [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

// TODO: this needs documented
- (void)listenForButtonPushRelease:(CDVInvokedUrlCommand*)command {
  listenForButtonPushReleaseCallbackContext = [command.callbackId copy];
}

// TODO: this needs documented
- (void)listenForDisconnect:(CDVInvokedUrlCommand*)command {
  listenForDisconnectCallbackContext = [command.callbackId copy];
}

// TODO: this needs documented
- (void)listenForThermaReading:(CDVInvokedUrlCommand*)command {
  listenForThermaReadingCallbackContext = [command.callbackId copy];
}

// TODO: this needs documented
- (void)listenForThermocoupleReading:(CDVInvokedUrlCommand*)command {
  listenForThermocoupleReadingCallbackContext = [command.callbackId copy];
}

// TODO: this needs documented
- (void)requestBatteryLevel:(CDVInvokedUrlCommand*)command {
  requestBatteryLevelCallbackContext = [command.callbackId copy];
  [self.selectedNodeDevice requestStatus];
}

// TODO: this needs documented
- (void)setStreamMode:(CDVInvokedUrlCommand*)command {
  // TODO: did we error?
  [self.selectedNodeDevice setStreamModeIRTherma:[[command.arguments objectAtIndex:0] boolValue] withLedPower:[[command.arguments objectAtIndex:1] boolValue] withEmissivity:0.95 withTimestampingEnabled:NO];

  CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
  [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

// TODO: this needs documented
- (void)setStreamModeThermocouple:(CDVInvokedUrlCommand*)command {
  // TODO: did we error?
  [self.selectedNodeDevice setStreamModeThermocouple:[[command.arguments objectAtIndex:0] boolValue] withPeriod:[[command.arguments objectAtIndex:1] integerValue] withLifetime:[[command.arguments objectAtIndex:2] integerValue]];

  CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
  [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

#pragma mark - CBCentralManagerDelegate

- (void)centralManager:(CBCentralManager *)central didDiscoverPeripheral:(CBPeripheral *)peripheral advertisementData:(NSDictionary *)advertisementData RSSI:(NSNumber *)RSSI {}
- (void)centralManagerDidUpdateState:(CBCentralManager *)central {}
- (void)centralManager:(CBCentralManager *)central didConnectPeripheral:(CBPeripheral *)peripheral {

  peripheral.delegate = self;

  // NOTE: it's inefficient to discover all services
  [peripheral discoverServices:nil];

  // NOTE: not calling connect success until characteristics are discovered

  // We found our node! Set it to scope!
  self.selectedNodeDevice = [[VTNodeDevice alloc] initWithDelegate:self withDevice:peripheral];
}

- (void)centralManager:(CBCentralManager *)central didDisconnectPeripheral:(CBPeripheral *)peripheral error:(NSError *)error {
  // TODO: figure out how to not repeat these...
  // Connection Status Push
  if (connectionCallbackContext) {
    CDVPluginResult *pluginResult = nil;
    pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"peripheral disconnected"];
    [pluginResult setKeepCallbackAsBool:FALSE];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:connectionCallbackContext];
  }
  // Disconnect Listener Push
  if (listenForDisconnectCallbackContext) {
    CDVPluginResult *pluginResult = nil;
    pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    [pluginResult setKeepCallbackAsBool:FALSE];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:listenForDisconnectCallbackContext];
  }
}

- (void)centralManager:(CBCentralManager *)central didFailToConnectPeripheral:(CBPeripheral *)peripheral error:(NSError *)error {
  // TODO: figure out how to not repeat these...
  // Connection Status Push
  if (connectionCallbackContext) {
    CDVPluginResult *pluginResult = nil;
    pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"failed to connect peripheral"];
    [pluginResult setKeepCallbackAsBool:FALSE];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:connectionCallbackContext];
  }
}

#pragma mark CBPeripheralDelegate

- (void)peripheral:(CBPeripheral *)peripheral didDiscoverServices:(NSError *)error {}
- (void)peripheral:(CBPeripheral *)peripheral didDiscoverCharacteristicsForService:(CBService *)service error:(NSError *)error {}
- (void)peripheral:(CBPeripheral *)peripheral didUpdateValueForCharacteristic:(CBCharacteristic *)characteristic error:(NSError *)error {}
- (void)peripheral:(CBPeripheral *)peripheral didUpdateNotificationStateForCharacteristic:(CBCharacteristic *)characteristic error:(NSError *)error {}
- (void)peripheral:(CBPeripheral *)peripheral didWriteValueForCharacteristic:(CBCharacteristic *)characteristic error:(NSError *)error {}

// TODO: verify this delegate name...
#pragma mark NodeConnectionDelegate

-(void)nodeDeviceIsReadyForCommunication:(VTNodeDevice *)device {
  // TODO: figure out how to not repeat these...
  // Connection Status Push
  if (connectionCallbackContext) {
    CDVPluginResult *pluginResult = nil;
    pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    [pluginResult setKeepCallbackAsBool:FALSE];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:connectionCallbackContext];
  }
}

-(void)nodeDeviceFailedToInit:(VTNodeDevice *)device {
  // TODO: figure out how to not repeat these...
  // Connection Status Push
  if (connectionCallbackContext) {
    CDVPluginResult *pluginResult = nil;
    pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"connected but failed to init"];
    [pluginResult setKeepCallbackAsBool:FALSE];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:connectionCallbackContext];
  }
}

// TODO: verify this delegate name...
#pragma mark NodeStatusDelegate

// -(void)nodeDeviceDidUpdateModuleTypes:(VTNodeDevice *)device typeA:(VTNodeModuleType)typeA typeB:(VTNodeModuleType)typeB {}

-(void)nodeDeviceDidUpdateBatteryLevel:(VTNodeDevice *)device withReading:(float)reading {
  if (requestBatteryLevelCallbackContext) {
    NSMutableDictionary *battery = [NSMutableDictionary
      dictionaryWithDictionary:@{
        @"volts": [NSNumber numberWithFloat:reading]
      }
    ];

    CDVPluginResult *pluginResult = nil;
    pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:battery];
    [pluginResult setKeepCallbackAsBool:FALSE];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:requestBatteryLevelCallbackContext];
  }
}

// TODO: verify this delegate name...
#pragma mark NodeButtonDelegate
-(void)nodeDeviceButtonPushed:(VTNodeDevice *)device {
  if (listenForButtonPushReleaseCallbackContext) {
    NSMutableDictionary *button = [NSMutableDictionary
      dictionaryWithDictionary:@{
        @"event": @"pushed"
      }
    ];

    CDVPluginResult *pluginResult = nil;
    pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:button];
    [pluginResult setKeepCallbackAsBool:TRUE];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:listenForButtonPushReleaseCallbackContext];
  }
}

-(void)nodeDeviceButtonReleased:(VTNodeDevice *)device {
  if (listenForButtonPushReleaseCallbackContext) {
    NSMutableDictionary *button = [NSMutableDictionary
      dictionaryWithDictionary:@{
        @"event": @"released"
      }
    ];

    CDVPluginResult *pluginResult = nil;
    pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:button];
    [pluginResult setKeepCallbackAsBool:TRUE];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:listenForButtonPushReleaseCallbackContext];
  }
}


// TODO: verify this delegate name...
#pragma mark NodeThermaDelegate
-(void)nodeDeviceDidUpdateIRThermaReading:(VTNodeDevice *)device withReading:(float)reading {
  NSMutableDictionary *sensor = [NSMutableDictionary
    dictionaryWithDictionary:@{
      @"event": @"nodeDeviceDidUpdateIRThermaReading",
      @"sensor": @"therma",
      @"celsius": [NSNumber numberWithFloat:reading],
      @"fahrenheit": [NSNumber numberWithFloat:((reading * 1.8) + 32)]
    }
  ];

  CDVPluginResult *pluginResult = nil;
  pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:sensor];
  [pluginResult setKeepCallbackAsBool:TRUE];
  [self.commandDelegate sendPluginResult:pluginResult callbackId:listenForThermaReadingCallbackContext];
}

// TODO: verify this delegate name...
#pragma mark NodeThermocoupleDelegate
-(void)nodeDeviceDidTransmitThermocoupleReading:(VTNodeDevice *)device withReading:(float)reading {
  NSMutableDictionary *sensor = [NSMutableDictionary
    dictionaryWithDictionary:@{
      @"event": @"nodeDeviceDidTransmitThermocoupleReading",
      @"sensor": @"thermocouple",
      @"celsius": [NSNumber numberWithFloat:reading],
      @"fahrenheit": [NSNumber numberWithFloat:((reading * 1.8) + 32)]
    }
  ];

  CDVPluginResult *pluginResult = nil;
  pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:sensor];
  [pluginResult setKeepCallbackAsBool:TRUE];
  [self.commandDelegate sendPluginResult:pluginResult callbackId:listenForThermocoupleReadingCallbackContext];
}

#pragma mark ?
- (CBPeripheral*)findPeripheralByUUID:(NSString*)uuid {
  CBPeripheral *peripheral = nil;

  NSArray * peripherals = [self.manager retrievePeripheralsWithIdentifiers:@[[[NSUUID alloc] initWithUUIDString:uuid]]];

  for (CBPeripheral *p in peripherals) {
    NSString* other = p.identifier.UUIDString;
    if ([uuid isEqualToString:other]) {
      peripheral = p;
      break;
    }
  }
  return peripheral;
}

@end
