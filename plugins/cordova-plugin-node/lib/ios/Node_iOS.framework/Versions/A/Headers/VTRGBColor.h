//
//  VTRGBColor.h
//  Node_iOS
//
//  Created by Wade Gasior on 1/7/15.
//  Copyright (c) 2015 Variable, Inc. All rights reserved.
//

#import <Foundation/Foundation.h>
#if TARGET_OS_IPHONE
#import <UIKit/UIKit.h>
#else
#import <Cocoa/Cocoa.h>
#endif
#import "VTColorUtils.h"

@interface VTRGBColor : NSObject

#if TARGET_OS_IPHONE
#define SKColor UIColor
#else
#define SKColor NSColor
#endif



@property (nonatomic, readonly) double r;
@property (nonatomic, readonly) double g;
@property (nonatomic, readonly) double b;
@property (nonatomic, readonly) double r255;
@property (nonatomic, readonly) double g255;
@property (nonatomic, readonly) double b255;
@property (nonatomic, readonly) double red;
@property (nonatomic, readonly) double green;
@property (nonatomic, readonly) double blue;
@property (nonatomic, readonly) VTColorUtilsRGBSpace rgbSpace;
@property (nonatomic, readonly) NSString *hex;

+ (instancetype) rgbColorWithR: (double) r withG: (double)g withB: (double) b inSpace: (VTColorUtilsRGBSpace) rgbSpace;
- (SKColor *) color;

@end
