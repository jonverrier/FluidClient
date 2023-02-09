// Copyright (c) 2023 TXPCo Ltd

import { GPoint, GRect } from './Geometry';
import { Interest, NotificationFor, Notifier } from './NotificationFramework';

export interface IShapeInteractor {

   click (pt: GPoint): void;
   mouseDown(pt: GPoint): void;
   mouseMove(pt: GPoint): void;
   mouseUp(pt: GPoint): void;
   rectangle: GRect;
}

export var shapeInteractionComplete: string = "ShapeInteractionComplete";
export var shapeInteractionCompleteInterest = new Interest(shapeInteractionComplete);

// Signature for the function called on completion
type FunctionFor<GRect> = (interest: Interest, data: NotificationFor<GRect>) => void;

var defaultDX: number = 100;
var defaultDY: number = 50;

var minimumDX: number = 16;
var minimumDY: number = 16;

export class ShapeInteractor extends Notifier implements IShapeInteractor  {

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

   click(pt: GPoint): void {
      var newRect: GRect = GRect.createAround(pt, defaultDX, defaultDY);
      this._rectangle = this._bounds.clip(GRect.ensureViableSize(newRect, minimumDX, minimumDY));

      this.notifyObservers(shapeInteractionCompleteInterest,
         new NotificationFor<GRect>(shapeInteractionCompleteInterest, this._rectangle));
   }

   mouseDown(pt: GPoint): void {
      var newRect: GRect = new GRect(pt.x, pt.y, 0, 0);
      this._rectangle = this._bounds.clip(newRect);
   }

   mouseMove(pt: GPoint): void {
      var newRect: GRect = new GRect(this._rectangle.x, this._rectangle.y, pt.x - this._rectangle.x, pt.y - this._rectangle.y);
      this._rectangle = this._bounds.clip(newRect);
   }

   mouseUp(pt: GPoint): void {
      var newRect: GRect = GRect.normaliseFromRectangle (new GRect(this._rectangle.x, this._rectangle.y, pt.x - this._rectangle.x, pt.y - this._rectangle.y));
      this._rectangle = this._bounds.clip(GRect.ensureViableSize(newRect, minimumDX, minimumDY));

      this.notifyObservers(shapeInteractionCompleteInterest,
         new NotificationFor<GRect>(shapeInteractionCompleteInterest, this._rectangle));
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