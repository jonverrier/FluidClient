// Copyright (c) 2023 TXPCo Ltd

import { GPoint } from './GeometryPoint';
import { GLine } from './GeometryLine';
import { GRect } from './GeometryRectangle';
import { NotificationFor } from './NotificationFramework';
import { IShapeInteractor, shapeInteractionCompleteInterest } from './ShapeInteractor';



// Interactor that lets the user draw a rectangle from mouse down to mouse up
export class NewRectangleInteractor extends IShapeInteractor  {

   private _rectangle: GRect;
   private _bounds: GRect;

   /**
    * Create a NewRectangleInteractor object
    * @param bounds_ - a GRect object defining the limits within which the shape can be created
    */
   public constructor(bounds_: GRect) {

      super();

      this._bounds = new GRect(bounds_);
      this._rectangle = new GRect();
   }

   interactionStart(pt: GPoint): void {
      var newRect: GRect = new GRect(pt.x, pt.y, 0, 0);
      this._rectangle = this._bounds.clipRectangle(newRect);
   }

   interactionUpdate(pt: GPoint): void {
      var newRect: GRect = new GRect(this._rectangle.x, this._rectangle.y, pt.x - this._rectangle.x, pt.y - this._rectangle.y);
      this._rectangle = this._bounds.clipRectangle(newRect);
   }

   interactionEnd(pt: GPoint): void {
      var newRect: GRect = GRect.normaliseRectangle(new GRect(this._rectangle.x, this._rectangle.y, pt.x - this._rectangle.x, pt.y - this._rectangle.y));
      this._rectangle = this._bounds.clipRectangle(GRect.ensureViableSize(newRect, IShapeInteractor.minimumDx(), IShapeInteractor.minimumDy()));

      this.notifyObservers(shapeInteractionCompleteInterest,
         new NotificationFor<GRect>(shapeInteractionCompleteInterest, this._rectangle));
   }

   /**
   * Convenience function for testing
   */
   get rectangle(): GRect {
      return this._rectangle;
   }
   get line(): GLine {
      return new GLine(this._rectangle.bottomLeft, this._rectangle.topRight);
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

   interactionUpdate(pt: GPoint): void {

      this.commonMouseProcessing(pt);
   }

   interactionEnd(pt: GPoint): void {

      this.commonMouseProcessing(pt);

      this.notifyObservers(shapeInteractionCompleteInterest,
         new NotificationFor<GRect>(shapeInteractionCompleteInterest, this._rectangle));
   }

   private commonMouseProcessing (pt: GPoint): void {

      var newRect: GRect = GRect.normaliseRectangle(new GRect(this._rectangle.x,
         this._rectangle.y,
         pt.x - (this._rectangle.x),
         this._rectangle.dy));

      this._rectangle = this._bounds.clipRectangle(GRect.ensureViableSize(newRect, IShapeInteractor.minimumDx(), IShapeInteractor.minimumDy()));
   }

   /**
   * Convenience function for testing
   */
   get rectangle(): GRect {
      return this._rectangle;
   }
   get line(): GLine {
      return new GLine(this._rectangle.bottomLeft, this._rectangle.topRight);
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

   interactionStart(pt: GPoint): void {

      this.commonMouseProcessing(pt);
   }

   interactionUpdate(pt: GPoint): void {

      this.commonMouseProcessing(pt);
   }

   interactionEnd(pt: GPoint): void {

      this.commonMouseProcessing(pt);

      this.notifyObservers(shapeInteractionCompleteInterest,
         new NotificationFor<GRect>(shapeInteractionCompleteInterest, this._rectangle));
   }

   private commonMouseProcessing(pt: GPoint): void {

      var newRect: GRect = GRect.normaliseRectangle(new GRect(pt.x,
         this._rectangle.y,
         this._rectangle.dx - (pt.x - this._rectangle.x),
         this._rectangle.dy));

      this._rectangle = this._bounds.clipRectangle(GRect.ensureViableSize(newRect, IShapeInteractor.minimumDx(), IShapeInteractor.minimumDy()));
   }

   /**
   * Convenience function for testing
   */
   get rectangle(): GRect {
      return this._rectangle;
   }
   get line(): GLine {
      return new GLine(this._rectangle.bottomLeft, this._rectangle.topRight);
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

   interactionStart(pt: GPoint): void {

      this.commonMouseProcessing(pt);
   }

   interactionUpdate(pt: GPoint): void {

      this.commonMouseProcessing(pt);
   }

   interactionEnd(pt: GPoint): void {

      this.commonMouseProcessing(pt);

      this.notifyObservers(shapeInteractionCompleteInterest,
         new NotificationFor<GRect>(shapeInteractionCompleteInterest, this._rectangle));
   }

   private commonMouseProcessing(pt: GPoint): void {

      var newRect: GRect = GRect.normaliseRectangle(new GRect(this._rectangle.x,
         this._rectangle.y,
         this._rectangle.dx,
         (pt.y - this._rectangle.y)));

      this._rectangle = this._bounds.clipRectangle(GRect.ensureViableSize(newRect, IShapeInteractor.minimumDx(), IShapeInteractor.minimumDy()));
   }

   /**
   * Convenience function for testing
   */
   get rectangle(): GRect {
      return this._rectangle;
   }
   get line(): GLine {
      return new GLine(this._rectangle.bottomLeft, this._rectangle.topRight);
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

   interactionStart(pt: GPoint): void {

      this.commonMouseProcessing(pt);
   }

   interactionUpdate(pt: GPoint): void {

      this.commonMouseProcessing(pt);
   }

   interactionEnd(pt: GPoint): void {

      this.commonMouseProcessing(pt);

      this.notifyObservers(shapeInteractionCompleteInterest,
         new NotificationFor<GRect>(shapeInteractionCompleteInterest, this._rectangle));
   }

   private commonMouseProcessing(pt: GPoint): void {

      var newRect: GRect = GRect.normaliseRectangle(new GRect(this._rectangle.x,
         pt.y,
         this._rectangle.dx,
         this._rectangle.dy - (pt.y - this._rectangle.y)));

      this._rectangle = this._bounds.clipRectangle(GRect.ensureViableSize(newRect, IShapeInteractor.minimumDx(), IShapeInteractor.minimumDy()));
   }

   /**
   * Convenience function for testing
   */
   get rectangle(): GRect {
      return this._rectangle;
   }
   get line(): GLine {
      return new GLine(this._rectangle.bottomLeft, this._rectangle.topRight);
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

   interactionStart(pt: GPoint): void {

      this.commonMouseProcessing(pt);
   }

   interactionUpdate(pt: GPoint): void {

      this.commonMouseProcessing(pt);
   }

   interactionEnd(pt: GPoint): void {

      this.commonMouseProcessing(pt);

      this.notifyObservers(shapeInteractionCompleteInterest,
         new NotificationFor<GRect>(shapeInteractionCompleteInterest, this._rectangle));
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
   get line(): GLine {
      return new GLine(this._rectangle.bottomLeft, this._rectangle.topRight);
   }
}

// Interactor that lets the user resize a rectangle from top left corner
// Uses a NewRectangleInteractor, but pins the opposite corner first -> desired resize effect.
export class TopLeftRectangleInteractor extends IShapeInteractor {

   private _freeRectInteractor: NewRectangleInteractor;

   /**
    * Create a TopLeftRectangleInteractor object
    * @param bounds_ - a GRect object defining the limits within which the shape can be created
    * @param rectangle_ - the initial rectangle for the object being moved
    */
   public constructor(bounds_: GRect, initial_: GRect) {

      super();

      this._freeRectInteractor = new NewRectangleInteractor(bounds_);
      this._freeRectInteractor.interactionStart(initial_.bottomRight);
   }

   interactionStart(pt: GPoint): void {
   }

   interactionUpdate(pt: GPoint): void {

      return this._freeRectInteractor.interactionUpdate(pt);
   }

   interactionEnd(pt: GPoint): void {

      this._freeRectInteractor.interactionEnd(pt);
      this.notifyObservers(shapeInteractionCompleteInterest,
         new NotificationFor<GRect>(shapeInteractionCompleteInterest, this._freeRectInteractor.rectangle));
   }

   /**
   * Convenience function for testing
   */
   get rectangle(): GRect {
      return this._freeRectInteractor.rectangle;
   }
   get line(): GLine {
      return new GLine(this.rectangle.bottomLeft, this.rectangle.topRight);
   }
}

// Interactor that lets the user resize a rectangle from top left corner
// Uses a NewRectangleInteractor, but pins the opposite corner first -> desired resize effect.
export class TopRightRectangleInteractor extends IShapeInteractor {

   private _freeRectInteractor: NewRectangleInteractor;

   /**
    * Create a TopLeftRectangleInteractor object
    * @param bounds_ - a GRect object defining the limits within which the shape can be created
    * @param rectangle_ - the initial rectangle for the object being moved
    */
   public constructor(bounds_: GRect, initial_: GRect) {

      super();

      this._freeRectInteractor = new NewRectangleInteractor(bounds_);
      this._freeRectInteractor.interactionStart(initial_.bottomLeft);
   }

   interactionStart(pt: GPoint): boolean {

      return false; // No need for further call
   }

   interactionUpdate(pt: GPoint): void {

      this._freeRectInteractor.interactionUpdate(pt);
   }

   interactionEnd(pt: GPoint): void {

      this._freeRectInteractor.interactionEnd(pt);
      this.notifyObservers(shapeInteractionCompleteInterest,
         new NotificationFor<GRect>(shapeInteractionCompleteInterest, this._freeRectInteractor.rectangle));
   }

   /**
   * Convenience function for testing
   */
   get rectangle(): GRect {
      return this._freeRectInteractor.rectangle;
   }
   get line(): GLine {
      return new GLine(this.rectangle.bottomLeft, this.rectangle.topRight);
   }
}

// Interactor that lets the user resize a rectangle from top left corner
// Uses a NewRectangleInteractor, but pins the opposite corner first -> desired resize effect.
export class BottomLeftRectangleInteractor extends IShapeInteractor {

   private _freeRectInteractor: NewRectangleInteractor;

   /**
    * Create a BottomLeftRectangleInteractor object
    * @param bounds_ - a GRect object defining the limits within which the shape can be created
    * @param rectangle_ - the initial rectangle for the object being moved
    */
   public constructor(bounds_: GRect, initial_: GRect) {

      super();

      this._freeRectInteractor = new NewRectangleInteractor(bounds_);
      this._freeRectInteractor.interactionStart(initial_.topRight);
   }

   interactionStart(pt: GPoint): void {
   }

   interactionUpdate(pt: GPoint): void {

      return this._freeRectInteractor.interactionUpdate(pt);
   }

   interactionEnd(pt: GPoint): void {

      this._freeRectInteractor.interactionEnd(pt);
      this.notifyObservers(shapeInteractionCompleteInterest,
         new NotificationFor<GRect>(shapeInteractionCompleteInterest, this._freeRectInteractor.rectangle));

   }

   /**
   * Convenience function for testing
   */
   get rectangle(): GRect {
      return this._freeRectInteractor.rectangle;
   }
   get line(): GLine {
      return new GLine(this.rectangle.bottomLeft, this.rectangle.topRight);
   }
}

// Interactor that lets the user resize a rectangle from top left corner
// Uses a NewRectangleInteractor, but pins the opposite corner first -> desired resize effect.
export class BottomRightRectangleInteractor extends IShapeInteractor {

   private _freeRectInteractor: NewRectangleInteractor;

   /**
    * Create a BottomRightRectangleInteractor object
    * @param bounds_ - a GRect object defining the limits within which the shape can be created
    * @param rectangle_ - the initial rectangle for the object being moved
    */
   public constructor(bounds_: GRect, initial_: GRect) {

      super();

      this._freeRectInteractor = new NewRectangleInteractor(bounds_);
      this._freeRectInteractor.interactionStart(initial_.topLeft);
   }

   interactionStart(pt: GPoint): void {
   }

   interactionUpdate(pt: GPoint): void {

      return this._freeRectInteractor.interactionUpdate(pt);
   }

   interactionEnd(pt: GPoint): void {

      this._freeRectInteractor.interactionEnd(pt);
      this.notifyObservers(shapeInteractionCompleteInterest,
         new NotificationFor<GRect>(shapeInteractionCompleteInterest, this._freeRectInteractor.rectangle));
   }

   /**
   * Convenience function for testing
   */
   get rectangle(): GRect {
      return this._freeRectInteractor.rectangle;
   }
   get line(): GLine {
      return new GLine(this.rectangle.bottomLeft, this.rectangle.topRight);
   }
}

