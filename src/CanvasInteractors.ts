// Copyright (c) 2023 TXPCo Ltd

import { GPoint, GRect } from './Geometry';
import { Interest, NotificationFor, Notifier } from './NotificationFramework';
import { Shape } from './Shape';

export enum HitTestResult {
   None = "None",
   Left = "Left", Right = "Right", Top = "Top", Bottom = "Bottom",
   TopLeft = "TopLeft", TopRight = "TopRight", BottomLeft = "BottomLeft", BottomRight = "BottomRight", 
   Border = "Border"
}

interface IShapeMover {

   interactionStart(pt: GPoint): boolean;
   interactionUpdate(pt: GPoint): boolean;
   interactionEnd(pt: GPoint): boolean;
   rectangle: GRect;
}

export abstract class IShapeInteractor extends Notifier implements IShapeMover {

   abstract interactionStart(pt: GPoint): boolean;
   abstract interactionUpdate(pt: GPoint): boolean;
   abstract interactionEnd(pt: GPoint): boolean;
   abstract rectangle: GRect;

   // Going to keep this in the interactor - may need to change handle size depending if we are in touch or mouse mode, which is an interaction thing,
   // Not a property of rectangles
   static defaultGrabHandleDxDy(): number {
      return 32;
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

export var shapeInteractionComplete: string = "ShapeInteractionComplete";
export var shapeInteractionCompleteInterest = new Interest(shapeInteractionComplete);

var defaultDX: number = 100;
var defaultDY: number = 50;

var minimumDX: number = 16;
var minimumDY: number = 16;

var defaultGrabHandleDXDY: number = 8;

// Interactor that lets the user draw a rectangle from mouse down to mouse up
export class FreeRectangleInteractor extends IShapeInteractor  {

   private _rectangle: GRect;
   private _bounds: GRect;

   /**
    * Create a FreeRectangleInteractor object
    * @param bounds_ - a GRect object defining the limits within which the shape can be created
    */
   public constructor(bounds_: GRect) {

      super();

      this._bounds = new GRect(bounds_);
      this._rectangle = new GRect();
   }

   interactionStart(pt: GPoint): boolean {
      var newRect: GRect = new GRect(pt.x, pt.y, 0, 0);
      this._rectangle = this._bounds.clipRectangle(newRect);

      return false; // No need for further call
   }

   interactionUpdate(pt: GPoint): boolean {
      var newRect: GRect = new GRect(this._rectangle.x, this._rectangle.y, pt.x - this._rectangle.x, pt.y - this._rectangle.y);
      this._rectangle = this._bounds.clipRectangle(newRect);

      return false; // No need for further call
   }

   interactionEnd(pt: GPoint): boolean {
      var newRect: GRect = GRect.normaliseRectangle (new GRect(this._rectangle.x, this._rectangle.y, pt.x - this._rectangle.x, pt.y - this._rectangle.y));
      this._rectangle = this._bounds.clipRectangle(GRect.ensureViableSize(newRect, minimumDX, minimumDY));

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

}

// Interactor that lets the user resize a rectangle with constrained Y values moving right hand border only
export class RightRectangleInteractor extends IShapeInteractor {

   private _rectangle: GRect;
   private _bounds: GRect;

   /**
    * Create a RightRectangleInteractor object
    * @param bounds_ - a GRect object defining the limits within which the shape can be created
    * @param rectangle_ - the initial rectangle for the object being moved
    */
   public constructor(bounds_: GRect, initial_: GRect) {

      super();

      this._bounds = new GRect(bounds_);
      this._rectangle = new GRect(initial_);
   }

   interactionStart(pt: GPoint): boolean {

      this.commonMouseProcessing(pt);

      return false; // No need for further call
   }

   interactionUpdate(pt: GPoint): boolean {

      this.commonMouseProcessing(pt);

      return false; // No need for further call
   }

   interactionEnd(pt: GPoint): boolean {

      this.commonMouseProcessing(pt);

      this.notifyObservers(shapeInteractionCompleteInterest,
         new NotificationFor<GRect>(shapeInteractionCompleteInterest, this._rectangle));

      return false; // No need for further call
   }

   private commonMouseProcessing (pt: GPoint): void {

      var newRect: GRect = GRect.normaliseRectangle(new GRect(this._rectangle.x,
         this._rectangle.y,
         pt.x - (this._rectangle.x),
         this._rectangle.dy));

      this._rectangle = this._bounds.clipRectangle(GRect.ensureViableSize(newRect, minimumDX, minimumDY));
   }

   /**
   * Convenience function for testing
   */
   get rectangle(): GRect {
      return this._rectangle;
   }
}

// Interactor that lets the user resize a rectangle with constrained Y values moving left hand border only
export class LeftRectangleInteractor extends IShapeInteractor {

   private _rectangle: GRect;
   private _bounds: GRect;

   /**
    * Create a LeftRectangleInteractor object
    * @param bounds_ - a GRect object defining the limits within which the shape can be created
    * @param rectangle_ - the initial rectangle for the object being moved
    */
   public constructor(bounds_: GRect, initial_: GRect) {

      super();

      this._bounds = new GRect(bounds_);
      this._rectangle = new GRect(initial_);
   }

   interactionStart(pt: GPoint): boolean {

      this.commonMouseProcessing(pt);

      return false; // No need for further call
   }

   interactionUpdate(pt: GPoint): boolean {

      this.commonMouseProcessing(pt);

      return false; // No need for further call
   }

   interactionEnd(pt: GPoint): boolean {

      this.commonMouseProcessing(pt);

      this.notifyObservers(shapeInteractionCompleteInterest,
         new NotificationFor<GRect>(shapeInteractionCompleteInterest, this._rectangle));

      return false; // No need for further call
   }

   private commonMouseProcessing(pt: GPoint): void {

      var newRect: GRect = GRect.normaliseRectangle(new GRect(pt.x,
         this._rectangle.y,
         this._rectangle.dx - (pt.x - this._rectangle.x),
         this._rectangle.dy));

      this._rectangle = this._bounds.clipRectangle(GRect.ensureViableSize(newRect, minimumDX, minimumDY));
   }

   /**
   * Convenience function for testing
   */
   get rectangle(): GRect {
      return this._rectangle;
   }
}

// Interactor that lets the user resize a rectangle with constrained X values moving top border only
export class TopRectangleInteractor extends IShapeInteractor {

   private _rectangle: GRect;
   private _bounds: GRect;

   /**
    * Create a TopRectangleInteractor object
    * @param bounds_ - a GRect object defining the limits within which the shape can be created
    * @param rectangle_ - the initial rectangle for the object being moved
    */
   public constructor(bounds_: GRect, initial_: GRect) {

      super();

      this._bounds = new GRect(bounds_);
      this._rectangle = new GRect(initial_);
   }

   interactionStart(pt: GPoint): boolean {

      this.commonMouseProcessing(pt);

      return false; // No need for further call
   }

   interactionUpdate(pt: GPoint): boolean {

      this.commonMouseProcessing(pt);

      return false; // No need for further call
   }

   interactionEnd(pt: GPoint): boolean {

      this.commonMouseProcessing(pt);

      this.notifyObservers(shapeInteractionCompleteInterest,
         new NotificationFor<GRect>(shapeInteractionCompleteInterest, this._rectangle));

      return false; // No need for further call
   }

   private commonMouseProcessing(pt: GPoint): void {

      var newRect: GRect = GRect.normaliseRectangle(new GRect(this._rectangle.x,
         this._rectangle.y,
         this._rectangle.dx,
         (pt.y - this._rectangle.y)));

      this._rectangle = this._bounds.clipRectangle(GRect.ensureViableSize(newRect, minimumDX, minimumDY));
   }

   /**
   * Convenience function for testing
   */
   get rectangle(): GRect {
      return this._rectangle;
   }
}

// Interactor that lets the user resize a rectangle with constrained X values moving top border only
export class BottomRectangleInteractor extends IShapeInteractor {

   private _rectangle: GRect;
   private _bounds: GRect;

   /**
    * Create a BottomRectangleInteractor object
    * @param bounds_ - a GRect object defining the limits within which the shape can be created
    * @param rectangle_ - the initial rectangle for the object being moved
    * 
    */
   public constructor(bounds_: GRect, initial_: GRect) {

      super();

      this._bounds = new GRect(bounds_);
      this._rectangle = new GRect(initial_);
   }

   interactionStart(pt: GPoint): boolean {

      this.commonMouseProcessing(pt);

      return false; // No need for further call
   }

   interactionUpdate(pt: GPoint): boolean {

      this.commonMouseProcessing(pt);

      return false; // No need for further call
   }

   interactionEnd(pt: GPoint): boolean {

      this.commonMouseProcessing(pt);

      this.notifyObservers(shapeInteractionCompleteInterest,
         new NotificationFor<GRect>(shapeInteractionCompleteInterest, this._rectangle));

      return false; // No need for further call
   }

   private commonMouseProcessing(pt: GPoint): void {

      var newRect: GRect = GRect.normaliseRectangle(new GRect(this._rectangle.x,
         pt.y,
         this._rectangle.dx,
         this._rectangle.dy - (pt.y - this._rectangle.y)));

      this._rectangle = this._bounds.clipRectangle(GRect.ensureViableSize(newRect, minimumDX, minimumDY));
   }

   /**
   * Convenience function for testing
   */
   get rectangle(): GRect {
      return this._rectangle;
   }
}

// Interactor that lets the user move a rectangle with constrained X values moving top border only
export class RectangleMoveInteractor extends IShapeInteractor {

   private _rectangle: GRect;
   private _bounds: GRect;
   private _initialPt: GPoint; // keep initial mouse pos, and initial rect, them all movements are relative
   private _initialRect: GRect;

   /**
    * Create a RectangleMoveInteractor object
    * @param bounds_ - a GRect object defining the limits within which the shape can be created
    * @param rectangle_ - the initial rectangle for the object being moved
    * @param start_ -  the start position of the mouse
    */
   public constructor(bounds_: GRect, initial_: GRect, start_: GPoint) {

      super();

      this._bounds = new GRect(bounds_);
      this._rectangle = new GRect(initial_);
      this._initialPt = new GPoint(start_);
      this._initialRect = new GRect(initial_);
   }

   interactionStart(pt: GPoint): boolean {

      this.commonMouseProcessing(pt);

      return false; // No need for further call
   }

   interactionUpdate(pt: GPoint): boolean {

      this.commonMouseProcessing(pt);

      return false; // No need for further call
   }

   interactionEnd(pt: GPoint): boolean {

      this.commonMouseProcessing(pt);

      this.notifyObservers(shapeInteractionCompleteInterest,
         new NotificationFor<GRect>(shapeInteractionCompleteInterest, this._rectangle));

      return false; // No need for further call
   }

   private commonMouseProcessing(pt: GPoint): void {

      let ptClipped = this._bounds.clipPoint(pt);

      let newRect = GRect.normaliseRectangle(new GRect(this._initialRect.x + (ptClipped.x - this._initialPt.x),
         this._initialRect.y + (ptClipped.y - this._initialPt.y),
         this._initialRect.dx,
         this._initialRect.dy));

      this._rectangle.assign(newRect);
   }

   /**
   * Convenience function for testing
   */
   get rectangle(): GRect {
      return this._rectangle;
   }
}

// Interactor that lets the user resize a rectangle from top left corner
// Uses a FreeRectangleInteractor, but pins the opposite corner first -> desired resize effect.
export class TopLeftRectangleInteractor extends IShapeInteractor {

   private _freeRectInteractor: FreeRectangleInteractor;

   /**
    * Create a TopLeftRectangleInteractor object
    * @param bounds_ - a GRect object defining the limits within which the shape can be created
    * @param rectangle_ - the initial rectangle for the object being moved
    */
   public constructor(bounds_: GRect, initial_: GRect) {

      super();

      this._freeRectInteractor = new FreeRectangleInteractor(bounds_);
      this._freeRectInteractor.interactionStart(initial_.bottomRight);
   }

   interactionStart(pt: GPoint): boolean {

      return false; // No need for further call
   }

   interactionUpdate(pt: GPoint): boolean {

      return this._freeRectInteractor.interactionUpdate(pt);
   }

   interactionEnd(pt: GPoint): boolean {

      this._freeRectInteractor.interactionEnd(pt);
      this.notifyObservers(shapeInteractionCompleteInterest,
         new NotificationFor<GRect>(shapeInteractionCompleteInterest, this._freeRectInteractor.rectangle));
      return false;
   }

   /**
   * Convenience function for testing
   */
   get rectangle(): GRect {
      return this._freeRectInteractor.rectangle;
   }
}

// Interactor that lets the user resize a rectangle from top left corner
// Uses a FreeRectangleInteractor, but pins the opposite corner first -> desired resize effect.
export class TopRightRectangleInteractor extends IShapeInteractor {

   private _freeRectInteractor: FreeRectangleInteractor;

   /**
    * Create a TopLeftRectangleInteractor object
    * @param bounds_ - a GRect object defining the limits within which the shape can be created
    * @param rectangle_ - the initial rectangle for the object being moved
    */
   public constructor(bounds_: GRect, initial_: GRect) {

      super();

      this._freeRectInteractor = new FreeRectangleInteractor(bounds_);
      this._freeRectInteractor.interactionStart(initial_.bottomLeft);
   }

   interactionStart(pt: GPoint): boolean {

      return false; // No need for further call
   }

   interactionUpdate(pt: GPoint): boolean {

      return this._freeRectInteractor.interactionUpdate(pt);
   }

   interactionEnd(pt: GPoint): boolean {

      this._freeRectInteractor.interactionEnd(pt);
      this.notifyObservers(shapeInteractionCompleteInterest,
         new NotificationFor<GRect>(shapeInteractionCompleteInterest, this._freeRectInteractor.rectangle));
      return false;
   }

   /**
   * Convenience function for testing
   */
   get rectangle(): GRect {
      return this._freeRectInteractor.rectangle;
   }
}

// Interactor that lets the user resize a rectangle from top left corner
// Uses a FreeRectangleInteractor, but pins the opposite corner first -> desired resize effect.
export class BottomLeftRectangleInteractor extends IShapeInteractor {

   private _freeRectInteractor: FreeRectangleInteractor;

   /**
    * Create a BottomLeftRectangleInteractor object
    * @param bounds_ - a GRect object defining the limits within which the shape can be created
    * @param rectangle_ - the initial rectangle for the object being moved
    */
   public constructor(bounds_: GRect, initial_: GRect) {

      super();

      this._freeRectInteractor = new FreeRectangleInteractor(bounds_);
      this._freeRectInteractor.interactionStart(initial_.topRight);
   }

   interactionStart(pt: GPoint): boolean {

      return false; // No need for further call
   }

   interactionUpdate(pt: GPoint): boolean {

      return this._freeRectInteractor.interactionUpdate(pt);
   }

   interactionEnd(pt: GPoint): boolean {

      this._freeRectInteractor.interactionEnd(pt);
      this.notifyObservers(shapeInteractionCompleteInterest,
         new NotificationFor<GRect>(shapeInteractionCompleteInterest, this._freeRectInteractor.rectangle));
      return false;
   }

   /**
   * Convenience function for testing
   */
   get rectangle(): GRect {
      return this._freeRectInteractor.rectangle;
   }
}

// Interactor that lets the user resize a rectangle from top left corner
// Uses a FreeRectangleInteractor, but pins the opposite corner first -> desired resize effect.
export class BottomRightRectangleInteractor extends IShapeInteractor {

   private _freeRectInteractor: FreeRectangleInteractor;

   /**
    * Create a BottomRightRectangleInteractor object
    * @param bounds_ - a GRect object defining the limits within which the shape can be created
    * @param rectangle_ - the initial rectangle for the object being moved
    */
   public constructor(bounds_: GRect, initial_: GRect) {

      super();

      this._freeRectInteractor = new FreeRectangleInteractor(bounds_);
      this._freeRectInteractor.interactionStart(initial_.topLeft);
   }

   interactionStart(pt: GPoint): boolean {

      return false; // No need for further call
   }

   interactionUpdate(pt: GPoint): boolean {

      return this._freeRectInteractor.interactionUpdate(pt);
   }

   interactionEnd(pt: GPoint): boolean {

      this._freeRectInteractor.interactionEnd(pt);
      this.notifyObservers(shapeInteractionCompleteInterest,
         new NotificationFor<GRect>(shapeInteractionCompleteInterest, this._freeRectInteractor.rectangle));
      return false;
   }

   /**
   * Convenience function for testing
   */
   get rectangle(): GRect {
      return this._freeRectInteractor.rectangle;
   }
}

// Interactor that works out if the mouse is over a click-able area of the shapes
export class HitTestInteractor extends IShapeInteractor {

   private _shapes: Map<string, Shape>;
   private _rectangle: GRect;
   private _lastHitTest: HitTestResult;
   private _lastHitShape: Shape;
   private _grabHandleDxDy: number;

   /**
    * Create a HitTestInteractor object
    * @param bounds_ - a GRect object defining the limits within which the shape can be created
    * @param rectangle_ - the rectangle enclosing the shape
    * @param grabHandleDxDy_ - size of the grab hadles if it is selected
    * */
   public constructor(shapes_: Map<string, Shape>,
      rectangle_: GRect,
      grabHandleDxDy_: number) {

      super();

      this._shapes = shapes_;
      this._rectangle = rectangle_;
      this._lastHitTest = HitTestResult.None;
      this._lastHitShape = null;
      this._grabHandleDxDy = grabHandleDxDy_;
   }

   interactionStart(pt: GPoint): boolean {
      return this.commonMouseProcessing(pt);
   }

   interactionUpdate(pt: GPoint): boolean {
      return this.commonMouseProcessing(pt);
   }

   interactionEnd(pt: GPoint): boolean {
      return this.commonMouseProcessing(pt);
   }

   private commonMouseProcessing(pt: GPoint): boolean {

      let hit: boolean = false;
      this._lastHitTest = HitTestResult.None;
      this._lastHitShape = null;

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
                     this._lastHitTest = HitTestResult.Left;
                     this._lastHitShape = shape;
                  }
                  else          
                  if (shape.boundingRectangle.isOnRightGrabHandle(pt, this._grabHandleDxDy)) {
                     hit = true;
                     this._lastHitTest = HitTestResult.Right;
                     this._lastHitShape = shape;
                  }
                  else
                  if (shape.boundingRectangle.isOnTopGrabHandle(pt, this._grabHandleDxDy)) {
                     hit = true;
                     this._lastHitTest = HitTestResult.Top;
                     this._lastHitShape = shape;
                  }
                  else
                  if (shape.boundingRectangle.isOnBottomGrabHandle(pt, this._grabHandleDxDy)) {
                     hit = true;
                     this._lastHitTest = HitTestResult.Bottom;
                     this._lastHitShape = shape;
                  }
                  else
                  if (shape.boundingRectangle.isOnTopLeftGrabHandle(pt, this._grabHandleDxDy)) {
                     hit = true;
                     this._lastHitTest = HitTestResult.TopLeft;
                     this._lastHitShape = shape;
                  }
                  else
                  if (shape.boundingRectangle.isOnTopRightGrabHandle(pt, this._grabHandleDxDy)) {
                     hit = true;
                     this._lastHitTest = HitTestResult.TopRight;
                     this._lastHitShape = shape;
                  }
                  else
                  if (shape.boundingRectangle.isOnBottomLeftGrabHandle(pt, this._grabHandleDxDy)) {
                     hit = true;
                     this._lastHitTest = HitTestResult.BottomLeft;
                     this._lastHitShape = shape;
                  }
                  else
                  if (shape.boundingRectangle.isOnBottomRightGrabHandle(pt, this._grabHandleDxDy)) {
                     hit = true;
                     this._lastHitTest = HitTestResult.BottomRight;
                     this._lastHitShape = shape;
                  }
                  else
                  if (shape.boundingRectangle.isOnBorder(pt)) {
                     hit = true;
                     this._lastHitTest = HitTestResult.Border;
                     this._lastHitShape = shape;
                  }
               }
               else
               if (shape.boundingRectangle.isOnBorder(pt)) {
                  hit = true;
                  this._lastHitTest = HitTestResult.Border;
                  this._lastHitShape = shape;
               }
            }
         }

      });

      return hit;
   }

   /**
   * Getters for private variables
   */
   get lastHitTest(): HitTestResult {

      return this._lastHitTest;
   }

   get lastHitShape(): Shape {

      return this._lastHitShape;
   }

   /**
   * Setters for private variables
   */
   set shapes(shapes_: Map<string, Shape>) {

      this._shapes = shapes_;
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