//
//  VTLCHColor.h
//  Node_iOS
//
//  Created by Wade Gasior on 1/8/15.
//  Copyright (c) 2015 Variable, Inc. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "VTColorUtils.h"

@class VTLabColor;

@interface VTLchColor : NSObject

@property (nonatomic, readonly) double L;
@property (nonatomic, readonly) double c;
@property (nonatomic, readonly) double h;
@property (readonly, nonatomic) VTColorUtilsWhitePointRef whitePointRef;
@property (nonatomic, readonly) VTColorUtilsObserver stdObserver;

+ (VTLchColor *) LchColorWithL: (double)L c:(double)c h:(double)h withWhitePointRef: (VTColorUtilsWhitePointRef) whitePointRef;

+ (VTLchColor *) LchColorWithL: (double)L c:(double)c h:(double)h withWhitePointRef: (VTColorUtilsWhitePointRef) whitePointRef withStdObserver:(VTColorUtilsObserver)observer;

- (VTLabColor *) toLAB;
@end
