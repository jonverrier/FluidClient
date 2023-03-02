// Copyright (c) 2023 TXPCo Ltd

import { GPoint } from './GeometryPoint';
import { Shape } from './Shape';

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

var firstHitTestFactory: ShapeHitTesterFactory = null;

export class ShapeHitTesterFactory {

   _className: string;
   _factoryMethod: FactoryFunctionFor<ShapeHitTester>;
   _nextFactory: ShapeHitTesterFactory;

   constructor(className_: string, factoryMethod_: FactoryFunctionFor<ShapeHitTester>) {
      this._className = className_;
      this._factoryMethod = factoryMethod_;
      this._nextFactory = null;

      if (firstHitTestFactory === null) {
         firstHitTestFactory = this;
      } else {
         var nextFactory: ShapeHitTesterFactory = firstHitTestFactory;

         while (nextFactory._nextFactory) {
            nextFactory = nextFactory._nextFactory;
         }
         nextFactory._nextFactory = this;
      }
   }

   static create(className: string,
      grabHandleDxDy_: number,
      tolerance_: number): ShapeHitTester {

      var nextFactory: ShapeHitTesterFactory = firstHitTestFactory;

      while (nextFactory) {
         if (nextFactory._className === className) {
            return nextFactory._factoryMethod(grabHandleDxDy_, tolerance_);
         }
         nextFactory = nextFactory._nextFactory;
      }
      return null;
   }
}

