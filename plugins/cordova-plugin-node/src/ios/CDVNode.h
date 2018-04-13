#ifndef CDVNode_h
#define CDVNode_h

#import <Cordova/CDV.h>
#import <CoreBluetooth/CoreBluetooth.h>

#import <Foundation/Foundation.h>
#import <Node_iOS/Node.h>
#import <objc/runtime.h>

@interface CDVNode : CDVPlugin <CBCentralManagerDelegate, CBPeripheralDelegate> {
    NSMutableDictionary *connectionCallbackContext;
    NSMutableDictionary *requestBatteryLevelCallbackContext;
    NSMutableDictionary *listenForButtonPushReleaseCallbackContext;
    NSMutableDictionary *listenForDisconnectCallbackContext;
    NSMutableDictionary *listenForThermaReadingCallbackContext;
    NSMutableDictionary *listenForThermocoupleReadingCallbackContext;
}

@property (strong, nonatomic) VTNodeDevice *selectedNodeDevice;
@property (strong, nonatomic) NSString* selectedNodeDeviceUUID;
@property (strong, nonatomic) NSString* temperature;

@property (strong, nonatomic) CBCentralManager *manager;

- (void)connect:(CDVInvokedUrlCommand *)command;
- (void)disconnect:(CDVInvokedUrlCommand *)command;
- (void)getDetails:(CDVInvokedUrlCommand *)command;
- (void)setStreamMode:(CDVInvokedUrlCommand *)command;
- (void)setStreamModeThermocouple:(CDVInvokedUrlCommand *)command;
- (void)requestBatteryLevel:(CDVInvokedUrlCommand *)command;
- (void)listenForButtonPushRelease:(CDVInvokedUrlCommand *)command;
- (void)listenForDisconnect:(CDVInvokedUrlCommand *)command;
- (void)listenForThermaReading:(CDVInvokedUrlCommand *)command;
- (void)listenForThermocoupleReading:(CDVInvokedUrlCommand *)command;

@end

#endif
