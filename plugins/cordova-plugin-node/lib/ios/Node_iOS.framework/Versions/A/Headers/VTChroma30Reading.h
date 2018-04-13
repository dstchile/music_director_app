//
//  VTChroma30Reading.h
//  Node_iOS
//
//  Created by Andrew T on 12/15/14.
//  Copyright (c) 2014 Variable, Inc. All rights reserved.
//

#import "VTRGBCReading.h"
#import "VTColorSenseObject.h"

@interface VTChroma30Reading : VTRGBCReading

@property (strong, nonatomic) VTColorSenseObject *senseObj;
-(id)initWith:(VTColorSenseObject *)senseObj chromaDevice:(VTChromaDevice*)chromaDevice;
-(id)initWith:(VTColorSenseObject *)senseObj chromaDevice:(VTChromaDevice*)chromaDevice observer:(VTColorUtilsObserver)observer;
-(void)recalculateColorVals;


@end
