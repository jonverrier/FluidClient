// Copyright (c) 2023 TXPCo Ltd

import { GPoint } from './GeometryPoint';
import { GLine } from './GeometryLine';
import { GRect } from './GeometryRectangle';
import { NotificationFor } from './NotificationFramework';
import { IShapeInteractor, shapeInteractionCompleteInterest } from './ShapeInteractor';
import { NewRectangleInteractor } from './RectangleInteractors';

// Interactor that lets the user resize a rectangle from top left corner
// Uses a NewRectangleInteractor, but pins the opposite corner first -> desired resize effect.
export class EraseInteractor extends IShapeInteractor {

   private _freeRectInteractor: NewRectangleInteractor;

   /**
    * Create a EraseInteractor object
    * @param bounds_ - a GRect object defining the limits within which the shape can be created
    */
   public constructor(bounds_: GRect) {

      super();

      this._freeRectInteractor = new NewRectangleInteractor(bounds_);
   }

   interactionStart(pt: GPoint): void {
      return this._freeRectInteractor.interactionStart(pt);
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
