//
//  VTChromaDeviceLoader.h
//  Node_iOS
//
//  Created by Wade Gasior on 5/21/15.
//  Copyright (c) 2015 Variable, Inc. All rights reserved.
//

#import <Foundation/Foundation.h>
@class VTChromaDevice;

@protocol VTChromaDeviceLoaderDelegate <NSObject>

- (void) chromaDeviceLoaderDidFetchChromaDevice: (VTChromaDevice *)chromaDevice;
- (void) chromaDeviceLoaderDidUpdateChromaFetchProgressForSerial: (NSString *)serial withProgress: (NSNumber *)progressPercent withMessage: (NSString *)message;

@end

@interface VTChromaDeviceLoader : NSObject

@property (strong, nonatomic) NSObject<VTChromaDeviceLoaderDelegate> *delegate;
@property (strong, nonatomic) NSString *chromaSerial;

+ (instancetype) chromaDeviceLoaderForSerial: (NSString *)chromaSerial withDelegate: (NSObject<VTChromaDeviceLoaderDelegate> *)delegate;
- (void) fetchChromaDeviceInBackground;

@end
