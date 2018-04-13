#import <Foundation/Foundation.h>
#import "VTXYZColor.h"
#import "VTLCHColor.h"
#import "VTColorUtils.h"
#import "VTLchColor.h"

@interface VTLabColor : NSObject
@property (nonatomic, readonly) double L;
@property (nonatomic, readonly) double A;
@property (nonatomic, readonly) double B;
@property (readonly, strong) VTLchColor *lchColor;
@property (nonatomic, readonly) VTXYZColor *XYZColor;
@property (nonatomic, readonly) VTColorUtilsWhitePointRef whitePointRef;
@property (nonatomic, readonly) VTColorUtilsObserver stdObserver;


+ (instancetype) labColorWithL: (double) l a: (double) a b: (double) b usingRef: (VTColorUtilsWhitePointRef) whitePointRef;
+ (instancetype) labColorWithL: (double) l a: (double) a b: (double) b usingRef: (VTColorUtilsWhitePointRef) whitePointRef usingObserver:(VTColorUtilsObserver)observer;

@end
