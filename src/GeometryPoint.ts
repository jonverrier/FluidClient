// Copyright (c) 2023 TXPCo Ltd

import Flatten from '@flatten-js/core'

import { InvalidParameterError } from './Errors';
import { MStreamable } from "./StreamingFramework";

export class GPoint extends MStreamable {

   private _pt: Flatten.Point;

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
            return;
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

   streamOut(): string {

      return JSON.stringify({ x: this._pt.x, y: this._pt.y });
   }

   streamIn(stream: string): void {

      const obj = JSON.parse(stream);

      this.assign(new GPoint(obj.x, obj.y));
   }
}

