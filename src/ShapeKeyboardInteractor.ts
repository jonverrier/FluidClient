// Copyright (c) 2023 TXPCo Ltd

import { GPoint } from './GeometryPoint';
import { GLine } from './GeometryLine';
import { GRect } from './GeometryRectangle';
import { IShapeKeyboardInteractor } from './ShapeInteractor';
import { Shape } from './Shape';

// Interactor that lets the user draw a rectangle from mouse down to mouse up
export class KeyboardInteractor implements IShapeKeyboardInteractor {

   private _bounds: GRect;
   private _shapes: Map<string, Shape>;

   /**
    * Create a KeyboardInteractor object
    * @param bounds_ - a GRect object defining the limits within which the shape can be created
    * @param shapes_ - map of a group of shapes on which to do the keyboard interation
    */
   public constructor(bounds_: GRect, shapes_: Map<string, Shape> ) {

      this._bounds = new GRect(bounds_);
      this._shapes = shapes_;
   }

   delete(): void {

      var deleteSet: Array<string> = new Array<string>();

      // accumulate a list of things to delete, dont delete as it messes up iteration
      this._shapes.forEach((shape: Shape, key: string) => {
         if (shape.isSelected) {
            deleteSet.push(key);
         }
      });

      // delete them once we have completed iteration
      deleteSet.forEach((id: string, index: number) => {
         this._shapes.delete(id);
      });
   }

   private accumulateSelectionCount (shapes: Map<string, Shape>) {

      var count = 0;

      // accumulate a boundary for selected shapes
      this._shapes.forEach((shape: Shape, key: string) => {

         if (shape.isSelected) {
            count++;
         }
      });

      return count;
   }

   private accumulateBounds(shapes: Map<string, Shape>) {

      var workingBounds: GRect = null;

      // accumulate a boundary for selected shapes
      this._shapes.forEach((shape: Shape, key: string) => {

         if (shape.isSelected) {
            if (workingBounds)
               workingBounds = GRect.accumulateBounds(workingBounds, shape.boundingRectangle);
            else
               workingBounds = new GRect(shape.boundingRectangle);
         }
      });

      if (!workingBounds)
         workingBounds = new GRect(0,0,0,0);

      return workingBounds;
   }

   moveLeft(n: number): void {

      var count = this.accumulateSelectionCount(this._shapes);
      var workingBounds = this.accumulateBounds (this._shapes);

      // Provided we have room, move selected items to the left
      if (count > 0 && (workingBounds.x - n > this._bounds.x)) {

         this._shapes.forEach((shape: Shape, key: string) => {

            if (shape.isSelected) {
               workingBounds = GRect.accumulateBounds(workingBounds, shape.boundingRectangle);

               shape.boundingRectangle = GRect.offset(shape.boundingRectangle, -n, 0);
            }
         });
      }
   }

   moveRight(n: number): void {

      var count = this.accumulateSelectionCount(this._shapes);
      var workingBounds = this.accumulateBounds(this._shapes);

      // Provided we have room, move selected items to the left
      if (count > 0 && (workingBounds.x + workingBounds.dx + n < (this._bounds.x + this._bounds.dx))) {

         this._shapes.forEach((shape: Shape, key: string) => {

            if (shape.isSelected) {
               workingBounds = GRect.accumulateBounds(workingBounds, shape.boundingRectangle);

               shape.boundingRectangle = GRect.offset(shape.boundingRectangle, n, 0);
            }
         });
      }
   }

   moveUp(n: number): void {

      var count = this.accumulateSelectionCount(this._shapes);
      var workingBounds = this.accumulateBounds(this._shapes);

      // Provided we have room, move selected items to the top
      if (count > 0 && (workingBounds.y + workingBounds.dy + n < (this._bounds.y + this._bounds.dy))) {

         this._shapes.forEach((shape: Shape, key: string) => {

            if (shape.isSelected) {
               workingBounds = GRect.accumulateBounds(workingBounds, shape.boundingRectangle);

               shape.boundingRectangle = GRect.offset(shape.boundingRectangle, 0, n);
            }
         });
      }
   }

   moveDown(n: number): void {

      var count = this.accumulateSelectionCount(this._shapes);
      var workingBounds = this.accumulateBounds(this._shapes);

      // Provided we have room, move selected items to the bottom
      if (count > 0 && (workingBounds.y - n > this._bounds.y)) {

         this._shapes.forEach((shape: Shape, key: string) => {

            if (shape.isSelected) {
               workingBounds = GRect.accumulateBounds(workingBounds, shape.boundingRectangle);

               shape.boundingRectangle = GRect.offset(shape.boundingRectangle, 0, -n);
            }
         });
      }
   }
}
