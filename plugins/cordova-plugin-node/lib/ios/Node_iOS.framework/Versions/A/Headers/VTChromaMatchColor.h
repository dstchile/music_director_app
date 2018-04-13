//
//  VTChromaMatchColor.h
//  Node
//
//  Created by Wade Gasior on 3/19/14.
//  Copyright (c) 2014 Variable, Inc. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "VTChromaMatchVendor.h"
#import "VTLabColor.h"

#if TARGET_OS_IPHONE
#import <UIKit/UIKit.h>
#endif

@interface VTChromaMatchColor : NSObject

@property (strong, nonatomic, readonly) VTChromaMatchColorSet *colorSet;
@property (strong, nonatomic, readonly) NSString *name;
@property (strong, nonatomic, readonly) VTLabColor *labColor;
@property (strong, nonatomic, readonly) VTRGBColor *rgbColor;

@property (nonatomic, readonly) double deltaEFromReading;

+ (VTChromaMatchColor *)color;
+ (VTChromaMatchColor *)colorWithdE: (double)dE set: (VTChromaMatchColorSet *)set name: (NSString *)name withLabColor: (VTLabColor *) labColor;

@end
