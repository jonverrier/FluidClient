// Copyright (c) 2023 TXPCo Ltd

import { GPoint } from './GeometryPoint';
import { GRect } from './GeometryRectangle';
import { Shape } from './Shape';
import { Rectangle } from './Rectangle';
import { EHitTest, HitTestResult, ShapeGroupHitTester, ShapeHitTester, ShapeHitTesterFactory } from './ShapeHitTester';

import { TextShape } from './Text';

/// <summary>
/// TextShapeHitTester - hit testing for Rectangle shape
/// <summary>
export class TextShapeHitTester extends ShapeHitTester {

   /**
    * Create a TextShapeHitTester object 
    * @param grabHandleDxDy_ - size of the grab handles if it is selected
    * @param tolerance_ - how close it needs to be * 
    */
   constructor(grabHandleDxDy_: number,
      tolerance_: number) {

      super(grabHandleDxDy_,
         tolerance_);

   }

   // to be overriden by derived classes. 
   hitTest(shape: Shape, pt: GPoint): HitTestResult {

      var testResult: HitTestResult = ShapeGroupHitTester.noHit();

      // first check the bounding box. If within, do more detailed tests, else skip them
      var rc: GRect = GRect.normaliseRectangle(shape.boundingRectangle);
      if (shape.isSelected)
         rc = GRect.inflate(rc, this.grabHandleDxDy / 2);

      if (rc.includes(pt)) {

         // Test all grab handles, then all borders
         if (shape.isSelected) {
            if (shape.boundingRectangle.isOnLeftGrabHandle(pt, this.grabHandleDxDy)) {
               testResult = { hitTest: EHitTest.Left, hitShape: shape };
            }
            else
            if (shape.boundingRectangle.isOnRightGrabHandle(pt, this.grabHandleDxDy)) {
               testResult = { hitTest: EHitTest.Right, hitShape: shape };
            }
            else
            if (shape.boundingRectangle.isOnTopGrabHandle(pt, this.grabHandleDxDy)) {
               testResult = { hitTest: EHitTest.Top, hitShape: shape };
            }
            else
            if (shape.boundingRectangle.isOnBottomGrabHandle(pt, this.grabHandleDxDy)) {
               testResult = { hitTest: EHitTest.Bottom, hitShape: shape };
            }
            else
            if (shape.boundingRectangle.isOnTopLeftGrabHandle(pt, this.grabHandleDxDy)) {
               testResult = { hitTest: EHitTest.TopLeft, hitShape: shape };
            }
            else
            if (shape.boundingRectangle.isOnTopRightGrabHandle(pt, this.grabHandleDxDy)) {
               testResult = { hitTest: EHitTest.TopRight, hitShape: shape };
            }
            else
            if (shape.boundingRectangle.isOnBottomLeftGrabHandle(pt, this.grabHandleDxDy)) {
               testResult = { hitTest: EHitTest.BottomLeft, hitShape: shape };
            }
            else
            if (shape.boundingRectangle.isOnBottomRightGrabHandle(pt, this.grabHandleDxDy)) {
               testResult = { hitTest: EHitTest.BottomRight, hitShape: shape };
            }
            else
            if (shape.boundingRectangle.isOnBorder(pt, this.tolerance)) {
               testResult = { hitTest: EHitTest.Border, hitShape: shape };
            }
         }
         else
         // Test inside the border if not selected
         if (shape.boundingRectangle.includes (pt)) {
            testResult = { hitTest: EHitTest.Border, hitShape: shape };
         }
      }

      return testResult;
   }

   static createInstance(grabHandleDxDy_: number, tolerance_: number): ShapeHitTester {
      return new TextShapeHitTester(grabHandleDxDy_, tolerance_);
   }

   static _factoryForText: ShapeHitTesterFactory = new ShapeHitTesterFactory(TextShape.textID(), TextShapeHitTester.createInstance);
}

