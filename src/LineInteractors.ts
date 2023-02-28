// Copyright (c) 2023 TXPCo Ltd

import { GPoint } from './GeometryPoint';
import { GLine } from './GeometryLine';
import { GRect } from './GeometryRectangle';
import { NotificationFor } from './NotificationFramework';
import { IShapeInteractor, shapeInteractionCompleteInterest } from './ShapeInteractors';

// Interactor that lets the user draw a rectangle from mouse down to mouse up
export class NewLineInteractor extends IShapeInteractor {

   private _line: GLine;
   private _bounds: GRect;

   /**
    * Create a NewRectangleInteractor object
    * @param bounds_ - a GRect object defining the limits within which the shape can be created
    */
   public constructor(bounds_: GRect) {

      super();

      this._bounds = new GRect(bounds_);
      this._line = new GLine();
   }

   interactionStart(pt: GPoint): boolean {
      pt = this._bounds.clipPoint(pt);
      this._line = new GLine(pt, pt);

      return false; // No need for further call
   }

   interactionUpdate(pt: GPoint): boolean {
      pt = this._bounds.clipPoint(pt);
      this._line = new GLine(this._line.start, pt);

      return false; // No need for further call
   }

   interactionEnd(pt: GPoint): boolean {
      pt = this._bounds.clipPoint(pt);
      this._line = new GLine(this._line.start, pt);

      this.notifyObservers(shapeInteractionCompleteInterest,
         new NotificationFor<GRect>(shapeInteractionCompleteInterest,
            new GRect(this._line.start, this._line.end)));

      return false; // No need for further call
   }

   /**
   * Convenience function for testing
   */
   get rectangle(): GRect {
      return new GRect(this._line.start, this._line.end);
   }
   get line(): GLine {
      return this._line;
   }
}

// Interactor that lets the user draw a rectangle from mouse down to mouse up
export class LineStartInteractor extends IShapeInteractor {

   private _line: GLine;
   private _bounds: GRect;

   /**
    * Create a LineStartInteractor object
    * @param bounds_ - a GRect object defining the limits within which the shape can be created
    * @param line_ - the initial value of the line
    */
   public constructor(bounds_: GRect, line_: GLine) {

      super();

      this._bounds = new GRect(bounds_);
      this._line = new GLine(line_);
   }

   interactionStart(pt: GPoint): boolean {
      pt = this._bounds.clipPoint(pt);
      this._line = new GLine(pt, this._line.end);

      return false; // No need for further call
   }

   interactionUpdate(pt: GPoint): boolean {
      pt = this._bounds.clipPoint(pt);
      this._line = new GLine(pt, this._line.end);

      return false; // No need for further call
   }

   interactionEnd(pt: GPoint): boolean {
      pt = this._bounds.clipPoint(pt);
      this._line = new GLine(pt, this._line.end);

      this.notifyObservers(shapeInteractionCompleteInterest,
         new NotificationFor<GRect>(shapeInteractionCompleteInterest,
            new GRect(this._line.start, this._line.end)));

      return false; // No need for further call
   }

   /**
   * Convenience function for testing
   */
   get rectangle(): GRect {
      return new GRect(this._line.start, this._line.end);
   }
   get line(): GLine {
      return this._line;
   }
}

// Interactor that lets the user draw a rectangle from mouse down to mouse up
export class LineEndInteractor extends IShapeInteractor {

   private _line: GLine;
   private _bounds: GRect;

   /**
    * Create a LineEndInteractor object
    * @param bounds_ - a GRect object defining the limits within which the shape can be created
    * @param line_ - the initial value of the line
    */
   public constructor(bounds_: GRect, line_: GLine) {

      super();

      this._bounds = new GRect(bounds_);
      this._line = new GLine(line_);
   }

   interactionStart(pt: GPoint): boolean {
      pt = this._bounds.clipPoint(pt);
      this._line = new GLine(this._line.start, pt);

      return false; // No need for further call
   }

   interactionUpdate(pt: GPoint): boolean {
      pt = this._bounds.clipPoint(pt);
      this._line = new GLine(this._line.start, pt);

      return false; // No need for further call
   }

   interactionEnd(pt: GPoint): boolean {
      pt = this._bounds.clipPoint(pt);
      this._line = new GLine(this._line.start, pt);

      this.notifyObservers(shapeInteractionCompleteInterest,
         new NotificationFor<GRect>(shapeInteractionCompleteInterest,
            new GRect(this._line.start, this._line.end)));

      return false; // No need for further call
   }

   /**
   * Convenience function for testing
   */
   get rectangle(): GRect {
      return new GRect(this._line.start, this._line.end);
   }
   get line(): GLine {
      return this._line;
   }
}

// Interactor that lets the user move a rectangle with constrained X values moving top border only
export class LineMoveInteractor extends IShapeInteractor {

   private _initial: GLine;
   private _updated: GLine;
   private _bounds: GRect;
   private _initialPt: GPoint; // keep initial mouse pos, and initial rect, them all movements are relative

   /**
    * Create a LineMoveInteractor object
    * @param bounds_ - a GRect object defining the limits within which the shape can be created
    * @param initial_ - the initial rectangle for the object being moved
    * @param start_ -  the start position of the mouse
    */
   public constructor(bounds_: GRect, initial_: GLine, start_: GPoint) {

      super();

      this._bounds = new GRect(bounds_);
      this._initial = new GLine(initial_);
      this._initialPt = new GPoint(start_);
      this._updated = new GLine(initial_);
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
         new NotificationFor<GRect>(shapeInteractionCompleteInterest, this.rectangle));

      return false; // No need for further call
   }

   private commonMouseProcessing(pt: GPoint): void {

      let ptClipped = this._bounds.clipPoint(pt);

      let newLine = new GLine (new GPoint(this._initial.start.x + (ptClipped.x - this._initialPt.x),
                                          this._initial.start.y + (ptClipped.y - this._initialPt.y)),
                               new GPoint(this._initial.end.x + (ptClipped.x - this._initialPt.x),
                                          this._initial.end.y + (ptClipped.y - this._initialPt.y)));

      this._updated.assign(newLine);
   }

   /**
   * Convenience function for testing
   */
   get rectangle(): GRect {
      return new GRect(this._updated.start, this._updated.end);
   }
   get line(): GLine {
      return new GLine(this._updated);
   }
}