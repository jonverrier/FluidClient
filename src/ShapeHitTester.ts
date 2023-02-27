// Copyright (c) 2023 TXPCo Ltd

import { GPoint } from './GeometryPoint';
import { GRect } from './GeometryRectangle';
import { GLine } from './GeometryLine';
import { Shape } from './Shape';
import { Rectangle } from './Rectangle';
import { Line } from './Line';

export enum EHitTest
{
   None = "None",
   Left = "Left", Right = "Right", Top = "Top", Bottom = "Bottom",
   TopLeft = "TopLeft", TopRight = "TopRight", BottomLeft = "BottomLeft", BottomRight = "BottomRight", 
   Border = "Border",
   Start = "Start", End = "End", Line="Line"
}

// Result of a hit test
export class HitTestResult {

   readonly hitTest: EHitTest;
   readonly hitShape: Shape;
};

// Interactor that works out if the mouse is over a click-able area of the shapes
export class ShapeGroupHitTester {

   private _shapes: Map<string, Shape>;
   private _grabHandleDxDy: number;
   private _tolerance: number;

   /**
    * Create a ShapeGroupHitTester object
    * @param shapes_ - a map containing the Shape objets to test
    * @param grabHandleDxDy_ - size of the grab hadles if it is selected
    * @param tolerance_ - how close it needs to be * 
    * */
   public constructor(shapes_: Map<string, Shape>,
      grabHandleDxDy_: number,
      tolerance_: number   ) {

      this._shapes = shapes_;
      this._grabHandleDxDy = grabHandleDxDy_;
      this._tolerance = tolerance_;
   }

   hitTest(pt: GPoint): HitTestResult {

      var testResult: HitTestResult = ShapeGroupHitTester.noHit();

      this._shapes.forEach((shape: Shape, key: string) => {

         if (testResult.hitTest === EHitTest.None) {

            // Use factory method to get the right hitTester for the class of the Shape
            var hitTester: ShapeHitTester = ShapeHitTesterFactory.create(shape.shapeID(), this._grabHandleDxDy, this._tolerance);
            testResult = hitTester.hitTest(shape, pt);
         }

      });

      return testResult;
   }

   static noHit(): HitTestResult {
      return { hitTest: EHitTest.None, hitShape: null };
   }
}

/// <summary>
/// ShapeHitTester - common super class for shape renderers
/// <summary>
export abstract class ShapeHitTester {

   private _grabHandleDxDy: number;
   private _tolerance: number;

   /**
    * Create a ShapeHitTester object 
    * @param grabHandleDxDy_ - size of the grab hadles if it is selected
    * @param tolerance_ - how close it needs to be 
    * 
    */
   constructor(grabHandleDxDy_: number,
      tolerance_: number) {

      this._grabHandleDxDy = grabHandleDxDy_;
      this._tolerance = tolerance_;
   }

   // to be overriden by derived classes. 
   abstract hitTest(shape: Shape, pt: GPoint): HitTestResult;

   /**
   * set of 'getters' and 'setters' for private variables
   */
   get tolerance(): number {
      return this._tolerance;
   }
   get grabHandleDxDy(): number {
      return this._grabHandleDxDy;
   }
}

// Signature for the factory function 
type FactoryFunctionFor<ShapeHitTester> = (grabHandleDxDy_: number, tolerance_: number) => ShapeHitTester;

var firstFactory: ShapeHitTesterFactory = null;

export class ShapeHitTesterFactory {

   _className: string;
   _factoryMethod: FactoryFunctionFor<ShapeHitTester>;
   _nextFactory: ShapeHitTesterFactory;

   constructor(className_: string, factoryMethod_: FactoryFunctionFor<ShapeHitTester>) {
      this._className = className_;
      this._factoryMethod = factoryMethod_;
      this._nextFactory = null;

      if (firstFactory === null) {
         firstFactory = this;
      } else {
         var nextFactory: ShapeHitTesterFactory = firstFactory;

         while (nextFactory._nextFactory) {
            nextFactory = nextFactory._nextFactory;
         }
         nextFactory._nextFactory = this;
      }
   }

   static create(className: string,
      grabHandleDxDy_: number,
      tolerance_: number): ShapeHitTester {

      var nextFactory: ShapeHitTesterFactory = firstFactory;

      while (nextFactory) {
         if (nextFactory._className === className) {
            return nextFactory._factoryMethod(grabHandleDxDy_, tolerance_);
         }
         nextFactory = nextFactory._nextFactory;
      }
      return null;
   }
}

/// <summary>
/// RectangleHitTester - common super class for shape renderers
/// <summary>
export class RectangleHitTester extends ShapeHitTester {

   /**
    * Create a RectangleHitTester object 
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
         // Only test the border if not selected
         if (shape.boundingRectangle.isOnBorder(pt, this.tolerance)) {
            testResult = { hitTest: EHitTest.Border, hitShape: shape };
         }
      }

      return testResult;
   }

   static createInstance(grabHandleDxDy_: number, tolerance_: number): ShapeHitTester {
      return new RectangleHitTester(grabHandleDxDy_, tolerance_);
   }

   static _factoryForRectangle: ShapeHitTesterFactory = new ShapeHitTesterFactory(Rectangle.rectangleID(), RectangleHitTester.createInstance);

   // TODO - this is a workaround until Caucus can dynamically create the right subtype of shape
   static _factoryForShape: ShapeHitTesterFactory = new ShapeHitTesterFactory(Shape.shapeID(), RectangleHitTester.createInstance);
}

/// <summary>
/// LineHitTester - common super class for shape renderers
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
