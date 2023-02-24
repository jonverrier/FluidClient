// Copyright (c) 2023 TXPCo Ltd

import { GPoint, GRect } from './Geometry';
import { Shape } from './Shape';

export enum EHitTest
{
   None = "None",
   Left = "Left", Right = "Right", Top = "Top", Bottom = "Bottom",
   TopLeft = "TopLeft", TopRight = "TopRight", BottomLeft = "BottomLeft", BottomRight = "BottomRight", 
   Border = "Border"
}

// Resulkt if a hit test
export class HitTestResult {

   readonly hitTest: EHitTest;
   readonly hitShape: Shape;
};

// Interactor that works out if the mouse is over a click-able area of the shapes
export class HitTester {

   private _shapes: Map<string, Shape>;
   private _grabHandleDxDy: number;

   /**
    * Create a HitTester object
    * @param shapes_ - a map containing the Shape objets to test
    * @param grabHandleDxDy_ - size of the grab hadles if it is selected
    * */
   public constructor(shapes_: Map<string, Shape>,
                      grabHandleDxDy_: number) {

      this._shapes = shapes_;
      this._grabHandleDxDy = grabHandleDxDy_;
   }

   hitTest(pt: GPoint): HitTestResult {

      let hit: boolean = false;
      var testResult: HitTestResult = HitTester.noHit();

      this._shapes.forEach((shape: Shape, key: string) => {

         if (!hit) {
            // first check the bounding box. If within, do more detailed tests, else skip them
            var rc: GRect;
            if (shape.isSelected)
               rc = GRect.inflate(shape.boundingRectangle, this._grabHandleDxDy / 2);
            else
               rc = shape.boundingRectangle;

            if (rc.includes(pt)) {

               if (shape.isSelected) {
                  if (shape.boundingRectangle.isOnLeftGrabHandle(pt, this._grabHandleDxDy)) {
                     hit = true;
                     testResult = { hitTest: EHitTest.Left, hitShape: shape };
                  }
                  else          
                  if (shape.boundingRectangle.isOnRightGrabHandle(pt, this._grabHandleDxDy)) {
                     hit = true;
                     testResult = { hitTest: EHitTest.Right, hitShape: shape };
                  }
                  else
                  if (shape.boundingRectangle.isOnTopGrabHandle(pt, this._grabHandleDxDy)) {
                     hit = true;
                     testResult = { hitTest: EHitTest.Top, hitShape: shape };
                  }
                  else
                  if (shape.boundingRectangle.isOnBottomGrabHandle(pt, this._grabHandleDxDy)) {
                     hit = true;
                     testResult = { hitTest: EHitTest.Bottom, hitShape: shape };
                  }
                  else
                  if (shape.boundingRectangle.isOnTopLeftGrabHandle(pt, this._grabHandleDxDy)) {
                     hit = true;
                     testResult = { hitTest: EHitTest.TopLeft, hitShape: shape };
                  }
                  else
                  if (shape.boundingRectangle.isOnTopRightGrabHandle(pt, this._grabHandleDxDy)) {
                     hit = true;
                     testResult = { hitTest: EHitTest.TopRight, hitShape: shape };
                  }
                  else
                  if (shape.boundingRectangle.isOnBottomLeftGrabHandle(pt, this._grabHandleDxDy)) {
                     hit = true;
                     testResult = { hitTest: EHitTest.BottomLeft, hitShape: shape };
                  }
                  else
                  if (shape.boundingRectangle.isOnBottomRightGrabHandle(pt, this._grabHandleDxDy)) {
                     hit = true;
                     testResult = { hitTest: EHitTest.BottomRight, hitShape: shape };
                  }
                  else
                  if (shape.boundingRectangle.isOnBorder(pt)) {
                     hit = true;
                     testResult = { hitTest: EHitTest.Border, hitShape: shape };
                  }
               }
               else
               if (shape.boundingRectangle.isOnBorder(pt)) {
                  hit = true;
                  testResult = { hitTest: EHitTest.Border, hitShape: shape };
               }
            }
         }

      });

      return testResult;
   }

   static noHit(): HitTestResult {
      return { hitTest: EHitTest.None, hitShape: null };
   }
}