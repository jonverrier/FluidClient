// Copyright (c) 2023 TXPCo Ltd

import Flatten from '@flatten-js/core'

import { InvalidParameterError } from './Errors';
import { MStreamable } from "./StreamingFramework";
import { GPoint } from './GeometryPoint';

export class GRect extends MStreamable {

   private _rc: Flatten.Box;
   private static minimumRelativeSizeForMidHandlesXY = 6; // borders have to be 6x the size of handles to get extra one in the mid point of border. 

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
         this._rc = new Flatten.Box(arr[0].x, arr[0].y, arr[1].x, arr[1].y);
         return;
      }
      else
      if (arr.length === 1) {
         if (this.isMyType(arr[0])) { // Copy Constructor
            this._rc = new Flatten.Box(arr[0]._rc.xmin, arr[0]._rc.ymin, arr[0]._rc.xmax, arr[0]._rc.ymax);
            return;
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

   get top(): number {
      return this._rc.ymax;
   }
   get right(): number {
      return this._rc.xmax;
   }

   get bottomLeft(): GPoint  {
      return new GPoint(this._rc.xmin, this._rc.ymin);
   }
   set bottomLeft(pt: GPoint) {
      this._rc.xmin = pt.x;
      this._rc.ymin = pt.y;
   }
   get topRight(): GPoint {
      return new GPoint(this._rc.xmax, this._rc.ymax);
   }
   set topRight(pt: GPoint) {
      this._rc.xmax = pt.x;
      this._rc.ymax = pt.y;
   }



   get topLeft(): GPoint {
      return new GPoint(this._rc.xmin, this._rc.ymax);
   }
   get topMiddle(): GPoint {
      return new GPoint(this._rc.xmin + (this.dx / 2), this._rc.ymax);
   }
   get bottomRight(): GPoint {
      return new GPoint(this._rc.xmax, this._rc.ymin);
   }
   get bottomMiddle(): GPoint {
      return new GPoint(this._rc.xmin + (this.dx / 2), this._rc.ymin);
   }
   get leftMiddle(): GPoint {
      return new GPoint(this._rc.xmin, this._rc.ymin + (this.dy / 2));
   }
   get rightMiddle(): GPoint {
      return new GPoint(this._rc.xmax, this._rc.ymin + (this.dy / 2));
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

      this._rc = new Flatten.Box(rhs.x, rhs.y, rhs.x + rhs.dx, rhs.y + rhs.dy);

      return this;
   }

   /**
    * Stream out to JSON
    */
   streamOut(): string {

      return JSON.stringify({ x: this._rc.xmin, y: this._rc.ymin, dx: this._rc.xmax - this._rc.xmin, dy: this._rc.ymax - this._rc.ymin });
   }

   /**
    * Stream in from JSON
    * @param stream - the stream to read in from  
    */
   streamIn(stream: string): void {

      const obj = JSON.parse(stream);

      this.assign(new GRect(obj.x, obj.y, obj.dx, obj.dy));
   }

   /**
    * Test if the rectangle rhs is fully within this one
    * @param rhs - the rectangle to test
    */
   fullyIncludes(rhs: GRect): boolean {
      return this._rc.xmin <= rhs._rc.xmin && this._rc.ymin <= rhs._rc.ymin && this._rc.xmax >= rhs._rc.xmax && this._rc.ymax >= rhs._rc.ymax;
   }

   /**
    * Test if the point pt is within this rectangle, including its border
    * @param pt - the point to test
    */
   includes(pt: GPoint): boolean {
      return this._rc.xmin <= pt.x && this._rc.ymin <= pt.y && this._rc.xmax >= pt.x && this._rc.ymax >= pt.y;
   }

   /**
    * Test if the point pt is on the left border
    * @param pt - the point to test
    * @param tolerance - how close it needs to be * 
    */
   isOnLeftBorder(pt: GPoint, tolerance: number): boolean {

      return ((Math.abs(this._rc.xmin - pt.x) <= tolerance) &&
         (this._rc.ymin <= pt.y) &&
         this._rc.ymax >= pt.y);
   }

   /**
    * Test if the point pt is on the right border
    * @param pt - the point to test
    * @param tolerance - how close it needs to be * 
    */
   isOnRightBorder(pt: GPoint, tolerance: number): boolean {
      return ((Math.abs(this._rc.xmax - pt.x) <= tolerance) &&
         (this._rc.ymin <= pt.y) &&
         (this._rc.ymax >= pt.y));
   }

   /**
    * Test if the point pt is on the top border
    * @param pt - the point to test
    * @param tolerance - how close it needs to be * 
    */
   isOnTopBorder(pt: GPoint, tolerance: number): boolean {
      return ((Math.abs(this._rc.ymax - pt.y) <= tolerance) &&
         (this._rc.xmin <= pt.x) &&
         this._rc.xmax >= pt.x);
   }

   /**
    * Test if the point pt is on the bottom border
    * @param pt - the point to test
    * @param tolerance - how close it needs to be * 
    */
   isOnBottomBorder(pt: GPoint, tolerance: number): boolean {
      return ((Math.abs(this._rc.ymin - pt.y) <= tolerance) &&
         (this._rc.xmin <= pt.x) &&
         this._rc.xmax >= pt.x);
   }

   /**
    * Test if the point pt is on any border
    * @param pt - the point  to test
    * @param tolerance - how close it needs to be 
    */
   isOnBorder(pt: GPoint, tolerance: number): boolean {

      return this.isOnBottomBorder(pt, tolerance) ||
         this.isOnLeftBorder(pt, tolerance) ||
         this.isOnRightBorder(pt, tolerance) ||
         this.isOnTopBorder(pt, tolerance);
   }

   /**
    * Test if the point pt is on the left grab handle
    * @param pt - the point to test
    * @param grabHandleDxDy - the size of grab handles to use
    */
   isOnLeftGrabHandle(pt: GPoint, grabHandleDxDy: number): boolean {

      if (!GRect.isTallEnoughForMidHandle(this, grabHandleDxDy))
         return false;

      var halfGrab: number = grabHandleDxDy / 2;
      var midY: number = (this._rc.ymin + this._rc.ymax) / 2;

      return (Math.abs(pt.y - midY) <= halfGrab) && (Math.abs(pt.x - this._rc.xmin) <= halfGrab);
   }

   /**
    * Test if the point pt is on the right grab handle
    * @param pt - the point to test
    * @param grabHandleDxDy - the size of grab handles to use
    */
   isOnRightGrabHandle(pt: GPoint, grabHandleDxDy: number): boolean {

      if (!GRect.isTallEnoughForMidHandle(this, grabHandleDxDy))
         return false;

      var halfGrab: number = grabHandleDxDy / 2;
      var midY: number = (this._rc.ymin + this._rc.ymax) / 2;

      return (Math.abs(pt.y - midY) <= halfGrab) && (Math.abs(pt.x - this._rc.xmax) <= halfGrab);
   }

   /**
    * Test if the point pt is on the top grab handle
    * @param pt - the point to test
    * @param grabHandleDxDy - the size of grab handles to use
    */
   isOnTopGrabHandle(pt: GPoint, grabHandleDxDy: number): boolean {

      if (!GRect.isWideEnoughForMidHandle(this, grabHandleDxDy))
         return false;

      var halfGrab: number = grabHandleDxDy / 2;
      var midX: number = (this._rc.xmin + this._rc.xmax) / 2;

      return (Math.abs(pt.x - midX) <= halfGrab) && (Math.abs(pt.y - this._rc.ymax) <= halfGrab);
   }

   /**
    * Test if the point pt is on the bottom grab handle
    * @param pt - the point to test
    * @param grabHandleDxDy - the size of grab handles to use
    */
   isOnBottomGrabHandle(pt: GPoint, grabHandleDxDy: number): boolean {

      if (!GRect.isWideEnoughForMidHandle(this, grabHandleDxDy))
         return false;

      var halfGrab: number = grabHandleDxDy / 2;
      var midX: number = (this._rc.xmin + this._rc.xmax) / 2;

      return (Math.abs(pt.x - midX) <= halfGrab) && (Math.abs(pt.y - this._rc.ymin) <= halfGrab);
   }

   /**
    * Test if the point pt is on the top left grab handle
    * @param pt - the point to test
    * @param grabHandleDxDy - the size of grab handles to use
    */
   isOnTopLeftGrabHandle(pt: GPoint, grabHandleDxDy: number): boolean {

      var halfGrab: number = grabHandleDxDy / 2;

      return (Math.abs(pt.x - this._rc.xmin) <= halfGrab) && (Math.abs(pt.y - this._rc.ymax) <= halfGrab);
   }

   /**
    * Test if the point pt is on the top right grab handle
    * @param pt - the point to test
    * @param grabHandleDxDy - the size of grab handles to use
    */
   isOnTopRightGrabHandle(pt: GPoint, grabHandleDxDy: number): boolean {

      var halfGrab: number = grabHandleDxDy / 2;

      return (Math.abs(pt.x - this._rc.xmax) <= halfGrab) && (Math.abs(pt.y - this._rc.ymax) <= halfGrab);
   }

   /**
    * Test if the point pt is on the bottom left grab handle
    * @param pt - the point to test
    * @param grabHandleDxDy - the size of grab handles to use
    */
   isOnBottomLeftGrabHandle(pt: GPoint, grabHandleDxDy: number): boolean {

      var halfGrab: number = grabHandleDxDy / 2;

      return (Math.abs(pt.x - this._rc.xmin) <= halfGrab) && (Math.abs(pt.y - this._rc.ymin) <= halfGrab);
   }

   /**
    * Test if the point pt is on the bottom right grab handle
    * @param pt - the point to test
    * @param grabHandleDxDy - the size of grab handles to use
    */
   isOnBottomRightGrabHandle(pt: GPoint, grabHandleDxDy: number): boolean {

      var halfGrab: number = grabHandleDxDy / 2;

      return (Math.abs(pt.x - this._rc.xmax) <= halfGrab) && (Math.abs(pt.y - this._rc.ymin) <= halfGrab);
   }

   /**
    * Clip rhs to fit withing the current rectangle
    * @param rhs - the rectangle to test
    */
   clipRectangle(rhs: GRect): GRect {

      let clipped = new GRect(rhs);

      if (clipped._rc.xmin < this._rc.xmin)
         clipped._rc.xmin = this._rc.xmin;
      if (clipped._rc.ymin < this._rc.ymin)
         clipped._rc.ymin = this._rc.ymin;

      if (clipped._rc.xmax > this._rc.xmax)
         clipped._rc.xmax = this._rc.xmax;
      if (clipped._rc.ymax > this._rc.ymax)
         clipped._rc.ymax = this._rc.ymax;

      return clipped;
   }

   /**
    * Clip rhs to fit withing the current rectangle
    * @param rhs - the point to clip
    */
   clipPoint(rhs: GPoint): GPoint {

      let clipped = new GPoint(rhs);

      if (clipped.x < this._rc.xmin)
         clipped.x = this._rc.xmin;
      if (clipped.y < this._rc.ymin)
         clipped.y = this._rc.ymin;

      if (clipped.x > this._rc.xmax)
         clipped.x = this._rc.xmax;
      if (clipped.y > this._rc.ymax)
         clipped.y = this._rc.ymax;

      return clipped;
   }

   /**
    * Create a normalised rectangle, i.e. top left (low) to lower right (hi)
    * @param pt1 - first point
    * @param pt2 - second point
    */
   static normalisePoints(pt1: GPoint, pt2: GPoint): GRect {

      var loX: number = Math.min(pt1.x, pt2.x);
      var loY: number = Math.min(pt1.y, pt2.y);
      var hiX: number = Math.max(pt1.x, pt2.x);
      var hiY: number = Math.max(pt1.y, pt2.y);

      return new GRect(loX, loY, hiX - loX, hiY - loY);
   }

   /**
    * Create a normalised rectangle, i.e. top left (low) to lower right (hi)
    * @param rect - the rectangle to normalise
    */
   static normaliseRectangle(rect: GRect): GRect {    

      return GRect.normalisePoints (rect.bottomLeft, rect.topRight);
   }

   static createAround (pt: GPoint, dx: number, dy: number): GRect {

      var loX: number = pt.x - dx / 2;
      var loY: number = pt.y - dy / 2;

      return new GRect(loX, loY, dx, dy);
   }

   static ensureViableSize (rc_: GRect, dx_: number, dy_: number): GRect {

      var working: GRect = new GRect (rc_);

      if (working.dx < dx_) {
         working.x -= dx_ / 2;
         working.dx = dx_;
      }
      if (working.dy < dy_) {
         working.y -= dy_ / 2;
         working.dy = dy_;
      }

      return working;
   }

   static createGrabHandlesAround(rc_: GRect, dx_: number, dy_: number): Array<GRect> {

      let handles = new Array<GRect>();

      let rc = GRect.createAround(rc_.topLeft, dx_, dy_);
      handles.push(rc);
      rc = GRect.createAround(rc_.topRight, dx_, dy_);
      handles.push(rc);
      rc = GRect.createAround(rc_.bottomLeft, dx_, dy_);
      handles.push(rc);
      rc = GRect.createAround(rc_.bottomRight, dx_, dy_);
      handles.push(rc);

      // Create extra horizontal handles if object is wide enough
      if (GRect.isWideEnoughForMidHandle(rc_, dx_)) {
         rc = GRect.createAround(rc_.topMiddle, dx_, dy_);
         handles.push(rc);
         rc = GRect.createAround(rc_.bottomMiddle, dx_, dy_);
         handles.push(rc);
      }

      // Create extra vertical handles if object is high enough
      if (GRect.isTallEnoughForMidHandle (rc_, dy_)) {
         rc = GRect.createAround(rc_.leftMiddle, dx_, dy_);
         handles.push(rc);
         rc = GRect.createAround(rc_.rightMiddle, dx_, dy_);
         handles.push(rc);
      }

      return handles;
   }

   static isWideEnoughForMidHandle(rc_: GRect, dx_: number): Boolean {

      // Create extra horizontal handles if object is wide enough
      return (rc_.dx >= dx_ * GRect.minimumRelativeSizeForMidHandlesXY);
   }

   static isTallEnoughForMidHandle(rc_: GRect, dy_: number): Boolean {

      // Create extra horizontal handles if object is wide enough
      return (rc_.dy >= dy_ * GRect.minimumRelativeSizeForMidHandlesXY);
   }

   static inflate(rc: GRect, dxy: number): GRect {

      return new GRect(rc.x - dxy, rc.y - dxy, rc.dx + dxy * 2, rc.dy + dxy * 2);

   }

   static minimumRelativeSizeForMidHandles (): number { 
      return GRect.minimumRelativeSizeForMidHandlesXY;
   }
}