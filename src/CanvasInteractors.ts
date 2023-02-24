// Copyright (c) 2023 TXPCo Ltd

import { GPoint, GRect } from './Geometry';
import { Interest, NotificationFor, Notifier } from './NotificationFramework';

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
