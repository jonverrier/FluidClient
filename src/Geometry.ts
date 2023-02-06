// Copyright (c) 2023 TXPCo Ltd

import Flatten from '@flatten-js/core'

import { InvalidParameterError } from './Errors';
import { MSerialisable } from "./SerialisationFramework";

export class GPoint extends MSerialisable {

   _pt: Flatten.Point;

   /**
    * Create a GPoint object
    * @param x_ - x coordinate
    * @param y_ - y coordinate
    */
   constructor(x_: number, y_: number)

   /**
    * Create a GPoint object
    * @param pt_ - value to copy 
    */
   public constructor (pt_: GPoint)

   /**
    * Create an empty GPoint object - required for particiation in serialisation framework
    */
   constructor();

   constructor(...arr: any[]) {

      super();

      if (arr.length === 2) { // Construct from individual coordinates
         this._pt = new Flatten.Point(arr[0], arr[1]);
         return;
      }
      else
      if (arr.length === 1) {
         if (this.isMyType(arr[0])) { // Copy Constructor
            this._pt = arr[0]._pt;
         }
         else {
            throw new InvalidParameterError("Cannot construct GPoint from unknown type.")
         }
      }
      else
      if (arr.length === 0) { // Empty Constructor
         this._pt = new Flatten.Point(0, 0);
         return;
      }
   }

   private isMyType(rhs: GPoint): boolean {
      return rhs && rhs.hasOwnProperty('_pt');
   }

   /**
   * set of 'getters' and 'setters' for private variables
   */
   get x(): number {
      return this._pt.x;
   }
   get y(): number {
      return this._pt.y;
   }

   set x (x_: number)  {
      this._pt.x = x_;
   }
   set y(y_: number) {
      this._pt.y = y_;
   }

   /**
    * test for equality - checks all fields are the same. 
    * NB must use field values, not identity bcs if objects are streamed to/from JSON, identities will be different. 
    * @param rhs - the object to compare this one to.  
    */
   equals(rhs: GPoint): boolean {

      return (this._pt.x === rhs._pt.x && this._pt.y === rhs._pt.y);
   }

   /**
    * assignment operator 
    * @param rhs - the object to assign this one from.  
    */
   assign(rhs: GPoint): GPoint {
      this._pt = rhs._pt;

      return this;
   }

   streamToJSON(): string {

      return JSON.stringify({ x: this._pt.x, y: this._pt.y });
   }

   streamFromJSON(stream: string): void {

      const obj = JSON.parse(stream);

      this.assign(new GPoint(obj.x, obj.y));
   }
}

export class GRect extends MSerialisable {

   _rc: Flatten.Box;

   /**
    * Create a GRect object
    * @param x_ - x coordinate
    * @param y_ - y coordinate
    * @param dx_ - dx (width) 
    * @param dy_ - dy (height) 
    */
   constructor(x_: number, y_: number, dx_: number, dy_: number)

   /**
    * Create a GRect object
    * @param pt1_ - top left
    * @param pt2_ - bottom right
    */
   public constructor(pt1_: GPoint, pt2_: GPoint)

   /**
    * Create a GRect object
    * @param rect_ - value to copy 
    */
   public constructor(rect: GRect)

   /**
    * Create an empty GRect object - required for particiation in serialisation framework
    */
   constructor();

   constructor(...arr: any[]) {

      super();

      if (arr.length === 4) { // Construct from individual coordinates
         this._rc = new Flatten.Box(arr[0], arr[1], arr[0] + arr[2], arr[1]+arr[3]);
         return;
      }
      else
      if (arr.length === 2) { // Construct from individual coordinates
         this._rc = new Flatten.Box(arr[0].x, arr[0].y, arr[1].x - arr[0].x, arr[1].y - arr[0].y);
         return;
      }
      else
      if (arr.length === 1) {
         if (this.isMyType(arr[0])) { // Copy Constructor
            this._rc = arr[0]._rc;
         }
         else {
            throw new InvalidParameterError("Cannot construct GRect from unknown type.")
         }
      }
      else
      if (arr.length === 0) { // Empty Constructor
         this._rc = new Flatten.Box(0, 0, 0, 0);
         return;
      }
   }

   private isMyType(rhs: GRect): boolean {
      return rhs && rhs.hasOwnProperty('_rc');
   }

   /**
   * set of 'getters' and 'setters' for private variables
   */
   get x(): number {
      return this._rc.xmin;
   }
   get y(): number {
      return this._rc.ymin;
   }

   set x(x_: number) {
      this._rc.xmin = x_;
   }
   set y(y_: number) {
      this._rc.ymin = y_;
   }

   get dx(): number {
      return this._rc.xmax - this._rc.xmin;
   }
   get dy(): number {
      return this._rc.ymax - this._rc.ymin;
   }

   set dx(x_: number) {
      this._rc.xmax = this._rc.xmin + x_;
   }
   set dy(y_: number) {
      this._rc.ymax = this._rc.ymin + y_;
   }

   /**
    * test for equality - checks all fields are the same. 
    * NB must use field values, not identity bcs if objects are streamed to/from JSON, identities will be different. 
    * @param rhs - the object to compare this one to.  
    */
   equals(rhs: GRect): boolean {

      return (this._rc.equal_to (rhs._rc));
   }

   /**
    * assignment operator 
    * @param rhs - the object to assign this one from.  
    */
   assign(rhs: GRect): GRect {
      this._rc = rhs._rc.clone();

      return this;
   }

   streamToJSON(): string {

      return JSON.stringify({ x: this._rc.xmin, y: this._rc.ymin, dx: this._rc.xmax - this._rc.xmin, dy: this._rc.ymax - this._rc.ymin });
   }

   streamFromJSON(stream: string): void {

      const obj = JSON.parse(stream);

      this.assign(new GRect(obj.x, obj.y, obj.dx, obj.dy));
   }
}