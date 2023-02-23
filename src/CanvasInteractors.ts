// Copyright (c) 2023 TXPCo Ltd

import { GPoint, GRect } from './Geometry';
import { Interest, NotificationFor, Notifier, INotifier, ObserverInterest } from './NotificationFramework';
import { Shape } from './Shape';

export enum HitTestResult {
   None = "None",
   Left = "Left", Right = "Right", Top = "Top", Bottom = "Bottom",
   TopLeft = "TopLeft", TopRight = "TopRight", BottomLeft = "BottomLeft", BottomRight = "BottomRight"
}

interface IShapeMover {

   click (pt: GPoint): boolean;
   mouseDown(pt: GPoint): boolean;
   mouseMove(pt: GPoint): boolean;
   mouseUp(pt: GPoint): boolean;
   rectangle: GRect;
}

export abstract class IShapeInteractor extends Notifier implements IShapeMover {

   abstract click(pt: GPoint): boolean;
   abstract mouseDown(pt: GPoint): boolean;
   abstract mouseMove(pt: GPoint): boolean;
   abstract mouseUp(pt: GPoint): boolean;
   abstract rectangle: GRect;

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

// Interactor that lets the user draw a rectangle from mouse down to mouse up
export class FreeRectangleInteractor extends IShapeInteractor  {

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

}

// Interactor that lets the user draw a rectangle with constrained Y values moving right hand border only
export class RightRectangleInteractor extends IShapeInteractor {

   private _rectangle: GRect;
   private _bounds: GRect;

   /**
    * Create a RightRectangleInteractor object
    * @param bounds_ - a GRect object defining the limits within which the shape can be created
    */
   public constructor(bounds_: GRect, initial_: GRect) {

      super();

      this._bounds = new GRect(bounds_);
      this._rectangle = new GRect(initial_);
   }

   click(pt: GPoint): boolean {

      return false; // No need for further call
   }

   mouseDown(pt: GPoint): boolean {

      this.commonMouseProcessing(pt);

      return false; // No need for further call
   }

   mouseMove(pt: GPoint): boolean {

      this.commonMouseProcessing(pt);

      return false; // No need for further call
   }

   mouseUp(pt: GPoint): boolean {

      this.commonMouseProcessing(pt);

      this.notifyObservers(shapeInteractionCompleteInterest,
         new NotificationFor<GRect>(shapeInteractionCompleteInterest, this._rectangle));

      return false; // No need for further call
   }

   private commonMouseProcessing (pt: GPoint): void {

      var newRect: GRect = GRect.normaliseFromRectangle(new GRect(this._rectangle.x,
         this._rectangle.y,
         pt.x - (this._rectangle.x),
         this._rectangle.dy));

      this._rectangle = this._bounds.clip(GRect.ensureViableSize(newRect, minimumDX, minimumDY));
   }

   /**
   * Convenience function for testing
   */
   get rectangle(): GRect {
      return this._rectangle;
   }
}

// Interactor that lets the user draw a rectangle with constrained Y values moving left hand border only
export class LeftRectangleInteractor extends IShapeInteractor {

   private _rectangle: GRect;
   private _bounds: GRect;

   /**
    * Create a LeftRectangleInteractor object
    * @param bounds_ - a GRect object defining the limits within which the shape can be created
    */
   public constructor(bounds_: GRect, initial_: GRect) {

      super();

      this._bounds = new GRect(bounds_);
      this._rectangle = new GRect(initial_);
   }

   click(pt: GPoint): boolean {

      return false; // No need for further call
   }

   mouseDown(pt: GPoint): boolean {

      this.commonMouseProcessing(pt);

      return false; // No need for further call
   }

   mouseMove(pt: GPoint): boolean {

      this.commonMouseProcessing(pt);

      return false; // No need for further call
   }

   mouseUp(pt: GPoint): boolean {

      this.commonMouseProcessing(pt);

      this.notifyObservers(shapeInteractionCompleteInterest,
         new NotificationFor<GRect>(shapeInteractionCompleteInterest, this._rectangle));

      return false; // No need for further call
   }

   private commonMouseProcessing(pt: GPoint): void {

      var newRect: GRect = GRect.normaliseFromRectangle(new GRect(pt.x,
         this._rectangle.y,
         this._rectangle.dx - (pt.x - this._rectangle.x),
         this._rectangle.dy));

      this._rectangle = this._bounds.clip(GRect.ensureViableSize(newRect, minimumDX, minimumDY));
   }

   /**
   * Convenience function for testing
   */
   get rectangle(): GRect {
      return this._rectangle;
   }
}

// Interactor that lets the user draw a rectangle with constrained X values moving top border only
export class TopRectangleInteractor extends IShapeInteractor {

   private _rectangle: GRect;
   private _bounds: GRect;

   /**
    * Create a TopRectangleInteractor object
    * @param bounds_ - a GRect object defining the limits within which the shape can be created
    */
   public constructor(bounds_: GRect, initial_: GRect) {

      super();

      this._bounds = new GRect(bounds_);
      this._rectangle = new GRect(initial_);
   }

   click(pt: GPoint): boolean {

      return false; // No need for further call
   }

   mouseDown(pt: GPoint): boolean {

      this.commonMouseProcessing(pt);

      return false; // No need for further call
   }

   mouseMove(pt: GPoint): boolean {

      this.commonMouseProcessing(pt);

      return false; // No need for further call
   }

   mouseUp(pt: GPoint): boolean {

      this.commonMouseProcessing(pt);

      this.notifyObservers(shapeInteractionCompleteInterest,
         new NotificationFor<GRect>(shapeInteractionCompleteInterest, this._rectangle));

      return false; // No need for further call
   }

   private commonMouseProcessing(pt: GPoint): void {

      var newRect: GRect = GRect.normaliseFromRectangle(new GRect(this._rectangle.x,
         this._rectangle.y,
         this._rectangle.dx,
         (pt.y - this._rectangle.y)));

      this._rectangle = this._bounds.clip(GRect.ensureViableSize(newRect, minimumDX, minimumDY));
   }

   /**
   * Convenience function for testing
   */
   get rectangle(): GRect {
      return this._rectangle;
   }
}

// Interactor that lets the user draw a rectangle with constrained X values moving top border only
export class BottomRectangleInteractor extends IShapeInteractor {

   private _rectangle: GRect;
   private _bounds: GRect;

   /**
    * Create a TopRectangleInteractor object
    * @param bounds_ - a GRect object defining the limits within which the shape can be created
    */
   public constructor(bounds_: GRect, initial_: GRect) {

      super();

      this._bounds = new GRect(bounds_);
      this._rectangle = new GRect(initial_);
   }

   click(pt: GPoint): boolean {

      return false; // No need for further call
   }

   mouseDown(pt: GPoint): boolean {

      this.commonMouseProcessing(pt);

      return false; // No need for further call
   }

   mouseMove(pt: GPoint): boolean {

      this.commonMouseProcessing(pt);

      return false; // No need for further call
   }

   mouseUp(pt: GPoint): boolean {

      this.commonMouseProcessing(pt);

      this.notifyObservers(shapeInteractionCompleteInterest,
         new NotificationFor<GRect>(shapeInteractionCompleteInterest, this._rectangle));

      return false; // No need for further call
   }

   private commonMouseProcessing(pt: GPoint): void {

      var newRect: GRect = GRect.normaliseFromRectangle(new GRect(this._rectangle.x,
         pt.y,
         this._rectangle.dx,
         this._rectangle.dy - (pt.y - this._rectangle.y)));

      this._rectangle = this._bounds.clip(GRect.ensureViableSize(newRect, minimumDX, minimumDY));
   }

   /**
   * Convenience function for testing
   */
   get rectangle(): GRect {
      return this._rectangle;
   }
}

// Interactor that works out if the mouse is over a click-able area of the shapes
export class HitTestInteractor extends IShapeInteractor {

   private _shapes: Map<string, Shape>;
   private _rectangle: GRect;
   private _lastHitTest: HitTestResult;
   private _lastHitShape: Shape;

   /**
    * Create a HitTestInteractor object
    * @param bounds_ - a GRect object defining the limits within which the shape can be created
    */
   public constructor(shapes_: Map<string, Shape>, rectangle_: GRect) {

      super();

      this._shapes = shapes_;
      this._rectangle = rectangle_;
      this._lastHitTest = HitTestResult.None;
      this._lastHitShape = null;
   }

   click(pt: GPoint): boolean {
      return this.commonMouseProcessing(pt);
   }

   mouseDown(pt: GPoint): boolean {
      return this.commonMouseProcessing(pt);
   }

   mouseMove(pt: GPoint): boolean {
      return this.commonMouseProcessing(pt);
   }

   mouseUp(pt: GPoint): boolean {
      return this.commonMouseProcessing(pt);
   }

   private commonMouseProcessing(pt: GPoint): boolean {

      let hit: boolean = false;
      this._lastHitTest = HitTestResult.None;
      this._lastHitShape = null;

      this._shapes.forEach((shape: Shape, key: string) => {

         if (!hit) {
            // for check the bounding box. If within, do more detailed tests, else skip them
            if (shape.boundingRectangle.includes(pt)) {

               if (shape.boundingRectangle.isOnLeftBorder(pt)) {
                  hit = true;
                  this._lastHitTest = HitTestResult.Left;
                  this._lastHitShape = shape;
               }
               else
               if (shape.boundingRectangle.isOnRightBorder(pt)) {
                  hit = true;
                  this._lastHitTest = HitTestResult.Right;
                  this._lastHitShape = shape;
                  }
               else
               if (shape.boundingRectangle.isOnTopBorder(pt)) {
                  hit = true;
                  this._lastHitTest = HitTestResult.Top;
                  this._lastHitShape = shape;
               }
               else
               if (shape.boundingRectangle.isOnBottomBorder(pt)) {
                  hit = true;
                  this._lastHitTest = HitTestResult.Bottom;
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