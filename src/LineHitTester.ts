// Copyright (c) 2023 TXPCo Ltd

import { GPoint } from './GeometryPoint';
import { GRect } from './GeometryRectangle';
import { GLine } from './GeometryLine';
import { Shape } from './Shape';
import { Line } from './Line';
import { EHitTest, HitTestResult, ShapeGroupHitTester, ShapeHitTester, ShapeHitTesterFactory } from './ShapeHitTester';


/// <summary>
/// LineHitTester - hit testing for Rectangle shape
/// <summary>
export class LineHitTester extends ShapeHitTester {

   /**
    * Create a LineHitTester object 
    * @param grabHandleDxDy_ - size of the grab hadles if it is selected
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

         var rc: GRect = shape.boundingRectangle;
         var line = new GLine (new GPoint(rc.x, rc.y), new GPoint(rc.x + rc.dx, rc.y + rc.dy));

         // Test all grab handles, then all borders
         if (shape.isSelected) {
            if (line.isOnStartGrabHandle(pt, this.grabHandleDxDy)) {
               testResult = { hitTest: EHitTest.Start, hitShape: shape };
            }
            else
            if (line.isOnEndGrabHandle(pt, this.grabHandleDxDy)) {
               testResult = { hitTest: EHitTest.End, hitShape: shape };
            }
            else
            if (line.isOnLine(pt, this.tolerance)) {
               testResult = { hitTest: EHitTest.Line, hitShape: shape };
            }               
         }
         else
         // Only test the border if not selected
         if (line.isOnLine(pt, this.tolerance)) {
            testResult = { hitTest: EHitTest.Line, hitShape: shape };
         }
      }

      return testResult;
   }

   static createInstance(grabHandleDxDy_: number, tolerance_: number): ShapeHitTester {
      return new LineHitTester(grabHandleDxDy_, tolerance_);
   }

   static _factoryForLine: ShapeHitTesterFactory = new ShapeHitTesterFactory(Line.lineID(), LineHitTester.createInstance);
}
