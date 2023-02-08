// Copyright (c) 2023 TXPCo Ltd

import { GPoint, GRect } from './Geometry';
import { Shape, Rectangle } from './Shape';

export interface IShapeController {

   click (pt: GPoint): void;
   mouseDown(pt: GPoint): void;
   mouseMove(pt: GPoint): void;
   mouseUp(pt: GPoint): void;

   rectangle(): GRect;
   isComplete(): boolean;
}

var defaultDX: number = 100;
var defaultDY: number = 66;

export class ShapeController implements IShapeController {

   private _isComplete: boolean;
   private _rectangle: GRect;
   private _bounds: GRect;

   /**
    * Create a NewRectangleController object
    * @param bounds_ - a GRect object defining the limits within which the shape can be created
    */
   public constructor(bounds_: GRect) {
      this._isComplete = false;
      this._bounds = new GRect(bounds_);
      this._rectangle = new GRect();
   }

   click(pt: GPoint): void {
      var newRect: GRect = new GRect(pt.x, pt.y, defaultDX, defaultDY);
      this._rectangle = this._bounds.clip(newRect);
      this._isComplete = true;
   }

   mouseDown(pt: GPoint): void {
      var newRect: GRect = new GRect(pt.x, pt.y, pt.x, pt.y);
      this._rectangle = this._bounds.clip(newRect);
   }

   mouseMove(pt: GPoint): void {
      var newRect: GRect = new GRect(this._rectangle.x, this._rectangle.y, pt.x - this._rectangle.x, pt.y - this._rectangle.y);
      this._rectangle = this._bounds.clip(newRect);
   }

   mouseUp(pt: GPoint): void {
      var newRect: GRect = new GRect(this._rectangle.x, this._rectangle.y, pt.x - this._rectangle.x, pt.y - this._rectangle.y);
      this._rectangle = this._bounds.clip(newRect);
      this._isComplete = true;
   }

   rectangle(): GRect {
      return this._rectangle;
   }

   isComplete(): boolean {
      return this._isComplete;
   }
}