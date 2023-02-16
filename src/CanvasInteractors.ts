// Copyright (c) 2023 TXPCo Ltd

import { GPoint, GRect } from './Geometry';
import { Interest, NotificationFor, Notifier } from './NotificationFramework';
import { Shape } from './Shape';

export enum HitTestResult {
   None = "None",
   Left = "Left", Right = "Right", Top = "Top", Bottom = "Bottom",
   TopLeft = "TopLeft", TopRight = "TopRight", BottomLeft = "BottomLeft", BottomRight = "BottomRight"
}

export interface IShapeInteractor {

   click (pt: GPoint): boolean;
   mouseDown(pt: GPoint): boolean;
   mouseMove(pt: GPoint): boolean;
   mouseUp(pt: GPoint): boolean;
   rectangle: GRect;
}

export var shapeInteractionComplete: string = "ShapeInteractionComplete";
export var shapeInteractionCompleteInterest = new Interest(shapeInteractionComplete);

var defaultDX: number = 100;
var defaultDY: number = 50;

var minimumDX: number = 16;
var minimumDY: number = 16;

// Interactor that lets the user draw a rectangle from mouse down to mouse up
export class FreeRectangleInteractor extends Notifier implements IShapeInteractor  {

   private _rectangle: GRect;
   private _bounds: GRect;

   /**
    * Create a NewRectangleController object
    * @param bounds_ - a GRect object defining the limits within which the shape can be created
    */
   public constructor(bounds_: GRect) {

      super();

      this._bounds = new GRect(bounds_);
      this._rectangle = new GRect();
   }

   click(pt: GPoint): boolean {
      var newRect: GRect = GRect.createAround(pt, defaultDX, defaultDY);
      this._rectangle = this._bounds.clip(GRect.ensureViableSize(newRect, minimumDX, minimumDY));

      this.notifyObservers(shapeInteractionCompleteInterest,
         new NotificationFor<GRect>(shapeInteractionCompleteInterest, this._rectangle));

      return false; // No need for further call
   }

   mouseDown(pt: GPoint): boolean {
      var newRect: GRect = new GRect(pt.x, pt.y, 0, 0);
      this._rectangle = this._bounds.clip(newRect);

      return false; // No need for further call
   }

   mouseMove(pt: GPoint): boolean {
      var newRect: GRect = new GRect(this._rectangle.x, this._rectangle.y, pt.x - this._rectangle.x, pt.y - this._rectangle.y);
      this._rectangle = this._bounds.clip(newRect);

      return false; // No need for further call
   }

   mouseUp(pt: GPoint): boolean {
      var newRect: GRect = GRect.normaliseFromRectangle (new GRect(this._rectangle.x, this._rectangle.y, pt.x - this._rectangle.x, pt.y - this._rectangle.y));
      this._rectangle = this._bounds.clip(GRect.ensureViableSize(newRect, minimumDX, minimumDY));

      this.notifyObservers(shapeInteractionCompleteInterest,
         new NotificationFor<GRect>(shapeInteractionCompleteInterest, this._rectangle));

      return false; // No need for further call
   }

   /**
   * Convenience function for testing
   */
   get rectangle(): GRect {
      return this._rectangle;
   }

   static defaultDx(): number {
      return defaultDX;
   }

   static defaultDy(): number {
      return defaultDY;
   }
   static minimumDx(): number {
      return minimumDX;
   }
   static minimumDy(): number {
      return minimumDY;
   }
}

// Interactor that works out if the mouse is over a click-able area of the shapes
export class HitTestInteractor extends Notifier implements IShapeInteractor {

   private _shapes: Map<string, Shape>;
   private _rectangle: GRect;
   private _lastHitTest: HitTestResult;

   /**
    * Create a HitTestInteractor object
    * @param bounds_ - a GRect object defining the limits within which the shape can be created
    */
   public constructor(shapes_: Map<string, Shape>, rectangle_: GRect) {

      super();

      this._shapes = shapes_;
      this._rectangle = rectangle_;
   }

   click(pt: GPoint): boolean {
      return false; // No need for further call
   }

   mouseDown(pt: GPoint): boolean {
      return false; // No need for further call
   }

   mouseMove(pt: GPoint): boolean {

      this._shapes.forEach((shape: Shape, key: string) => {

         // for check the bounding box. If within, do more detailed tests, else skip them
         if (shape.boundingRectangle.includes(pt)) {
            // TODO - more hitesting here, store an extra result? 
            return true;
         }

      });

      return false;
   }

   mouseUp(pt: GPoint): boolean {
      return false; // No need for further call
   }

   lastHitTest(): HitTestResult {

      return this._lastHitTest;
   }

   /**
   * Convenience functions for testing
   */
   get shapes(): Map<string, Shape> {
      return this._shapes;
   }
   get rectangle(): GRect {
      return this._rectangle;
   }
}