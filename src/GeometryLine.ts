// Copyright (c) 2023 TXPCo Ltd

import Flatten from '@flatten-js/core'

import { InvalidParameterError } from './Errors';
import { MStreamable } from "./StreamingFramework";
import { GPoint } from './GeometryPoint';
import { GRect } from './GeometryRectangle';

export class GLine extends MStreamable {

   private _line: Flatten.Segment; 

   /**
    * Create a GLine object
    * @param x1_ - x1 coordinate
    * @param y1_ - y1 coordinate
    * @param x2_ - x2 coordinate 
    * @param y2_ - y2 coordinate 
    */
   constructor(x_: number, y_: number, dx_: number, dy_: number)

   /**
    * Create a GLine object
    * @param pt1_ - top left
    * @param pt2_ - bottom right
    */
   public constructor(pt1_: GPoint, pt2_: GPoint)

   /**
    * Create a GLine object
    * @param line_ - value to copy 
    */
   public constructor(line_: GLine)

   /**
    * Create an empty GRect object - required for particiation in serialisation framework
    */
   constructor();

   constructor(...arr: any[]) {

      super();

      if (arr.length === 4) { // Construct from individual coordinates
         this._line = new Flatten.Segment(new Flatten.Point(arr[0], arr[1]),
                                          new Flatten.Point(arr[2], arr[3]));
         return;
      }
      else
      if (arr.length === 2) { // Construct from individual coordinates
         this._line = new Flatten.Segment(new Flatten.Point(arr[0].x, arr[0].y),
                                          new Flatten.Point(arr[1].x, arr[1].y));
         return;
      }
      else
      if (arr.length === 1) {
         if (this.isMyType(arr[0])) { // Copy Constructor
            this._line = new Flatten.Segment(new Flatten.Point(arr[0]._line.start.x, arr[0]._line.start.y),
                                             new Flatten.Point(arr[0]._line.end.x, arr[0]._line.end.y));
            return;
         }
         else {
            throw new InvalidParameterError("Cannot construct GLine from unknown type.")
         }
      }
      else
      if (arr.length === 0) { // Empty Constructor
         this._line = new Flatten.Segment(new Flatten.Point(0, 0),
                                          new Flatten.Point(0, 0));
         return;
      }
   }

   private isMyType(rhs: GLine): boolean {
      return rhs && rhs.hasOwnProperty('_line');
   }

   /**
   * set of 'getters' and 'setters' for private variables
   */
   get start(): GPoint {
      return new GPoint(this._line.start.x, this._line.start.y);
   }
   get end(): GPoint {
      return new GPoint(this._line.end.x, this._line.end.y);
   }

   get boundingRectangle (): GRect {
      return new GRect(new GPoint(this._line.start.x, this._line.start.y), new GPoint(this._line.end.x, this._line.end.y))
   }
   
   /**
    * test for equality - checks all fields are the same. 
    * NB must use field values, not identity bcs if objects are streamed to/from JSON, identities will be different. 
    * @param rhs - the object to compare this one to.  
    */
   equals(rhs: GLine): boolean {

      return (this._line.equalTo (rhs._line));
   }

   /**
    * assignment operator 
    * @param rhs - the object to assign this one from.  
    */
   assign(rhs: GLine): GLine {

      this._line = new Flatten.Segment(new Flatten.Point(rhs._line.start.x, rhs._line.start.y),
                                       new Flatten.Point(rhs._line.end.x, rhs._line.end.y));

      return this;
   }

   /**
    * Stream out to JSON
    */
   streamOut(): string {

      return JSON.stringify({ start: { x: this._line.start.x, y: this._line.start.y },  end: { x: this._line.end.x, y: this._line.end.y } });
   }

   /**
    * Stream in from JSON
    * @param stream - the stream to read in from  
    */
   streamIn(stream: string): void {

      const obj = JSON.parse(stream);

      this.assign(new GLine(obj.start.x, obj.start.y, obj.end.x, obj.end.y));
   }

   /**
    * Test if the point pt is on the start grab handle
    * @param pt - the point to test
    * @param grabHandleDxDy - the size of grab handles to use
    */
   isOnStartGrabHandle(pt: GPoint, grabHandleDxDy: number): boolean {

      var halfGrab: number = grabHandleDxDy / 2;

      return (Math.abs(pt.y - this._line.start.y) <= halfGrab) && (Math.abs(pt.x - this._line.start.x) <= halfGrab);
   }

   /**
    * Test if the point pt is on the end grab handle
    * @param pt - the point to test
    * @param grabHandleDxDy - the size of grab handles to use
    */
   isOnEndGrabHandle(pt: GPoint, grabHandleDxDy: number): boolean {

      var halfGrab: number = grabHandleDxDy / 2;

      return (Math.abs(pt.y - this._line.end.y) <= halfGrab) && (Math.abs(pt.x - this._line.end.x) <= halfGrab);
   }

   /**
    * Test if the point pt is on the line
    * @param pt - the point to test
    * @param tolerance - the size of grab handles to use
    */
   isOnLine(pt: GPoint, tolerance: number): boolean {

      let distance = this._line.distanceTo(new Flatten.Point(pt.x, pt.y));

      return distance[0] <= tolerance;
   }

   static createGrabHandlesAround(line_: GLine, dx_: number, dy_: number): Array<GRect> {

      let handles = new Array<GRect>();

      let rc = GRect.createAround(line_.start, dx_, dy_);
      handles.push(rc);
      rc = GRect.createAround(line_.end, dx_, dy_);
      handles.push(rc);

      return handles;
   }   
}