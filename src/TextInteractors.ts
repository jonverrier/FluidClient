// Copyright (c) 2023 TXPCo Ltd

import { GPoint } from './GeometryPoint';
import { GLine } from './GeometryLine';
import { GRect } from './GeometryRectangle';
import { NotificationFor } from './NotificationFramework';
import { IShapeInteractor, shapeInteractionCompleteInterest } from './ShapeInteractor';

// Interactor that lets the user draw a rectangle from mouse down to mouse up
export class NewTextInteractor extends IShapeInteractor {

   private _rectangle: GRect;
   private _bounds: GRect;

   /**
    * Create a NewTextInteractor object
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

   /**
    * Let the calling component know we have a UI to complete the interaction, which it will need to render
    */
   hasUI(): boolean {
      return false;
   }; 
}

// Interactor that lets the user edit text
export class TextEditInteractor extends IShapeInteractor {

   private _rectangle: GRect;

   /**
    * Create a TextEditInteractor object
    * @param rectangle_ - a GRect object defining the boundary of the text edit object
    */
   public constructor(rectangle_: GRect) {

      super();

      this._rectangle = new GRect(rectangle_);
   }

   interactionStart(pt: GPoint): void {
   }

   interactionUpdate(pt: GPoint): void {
   }

   interactionEnd(pt: GPoint): void {
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

   /**
    * Let the calling component know we have a UI for text editing, which it will need to render
    */
   hasUI(): boolean {
      return true;
   }; 
}