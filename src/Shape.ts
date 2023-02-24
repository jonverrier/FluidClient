// Copyright (c) 2023 TXPCo Ltd

import { InvalidParameterError } from './Errors';
import { uuid } from './Uuid';
import { MSerialisable } from "./SerialisationFramework";
import { GRect } from "./Geometry";
import { Pen, PenColour, PenStyle } from "./Pen";
import { ShapeFactory } from './ShapeFactory';

const nullShapeUuid: string = "374cb6a8-b229-4cde-843f-c530df79dca6";

// Keys to use for dynamic creation of Shape subtypes
const shapeID: string = "Shape";
const selectionRectangleID: string = "SelectionRectangle";
const rectangleID: string = "Rectangle";

export class Shape extends MSerialisable {

   _id: string;
   _boundingRectangle: GRect;
   _pen: Pen;
   _isSelected: boolean;

   /**
    * Create a Shape object
    * @param uuid - uuid for the shape (e.g we create a local copy of a shpe created remotely and need to retain the ID)
    * @param boundingRectangle_ - boundingRectangle
    * @param pen_ - pen
    * @param isSelected_ - true if object is selected and needs to draw and hit-test grab handles
    */
   public constructor(uuid: string, boundingRectangle_: GRect, pen_: Pen, isSelected_: boolean)

   /**
    * Create a Shape object
    * @param boundingRectangle_ - boundingRectangle
    * @param pen_ - pen
    * @param isSelected_ - true if object is selected and needs to draw and hit-test grab handles
    */
   public constructor(boundingRectangle_: GRect, pen_: Pen, isSelected_: boolean)

   /**
    * Create a Shape object
    * @param shape_ - object to copy 
    */
   public constructor(shape_: Shape)

   /**
    * Create an empty Shape object - required for particiation in serialisation framework
    */
   constructor();

   constructor(...arr: any[]) {

      super();

      if (arr.length === 4) { // Construct from individual parameters including ID
         this._id = arr[0];
         this._boundingRectangle = new GRect(arr[1]);
         this._pen = arr[2];
         this._isSelected = arr[3];
         return;
      }
      else
         if (arr.length === 3) { // Construct from individual parameters
         this._id = uuid();
         this._boundingRectangle = new GRect (arr[0]);
         this._pen = new Pen (arr[1]);
         this._isSelected = arr[2];
         return;
      }
      else
      if (arr.length === 1) {
         if (Shape.isMyType(arr[0])) { // Copy Constructor
            this._id = arr[0]._id;
            this._boundingRectangle = new GRect(arr[0]._boundingRectangle);
            this._pen = new Pen (arr[0]._pen);
            this._isSelected = arr[0]._isSelected;
            return;
         }
         else {
            throw new InvalidParameterError("Cannot construct Shape from unknown type.")
         }
      }
      else
      if (arr.length === 0) { // Empty Constructor
         this._id = uuid();
         this._boundingRectangle = new GRect;
         this._pen = new Pen();
         this._isSelected = false;
         return;
      }
   }

   protected static isMyType(rhs: Shape): boolean {
      return rhs && rhs.hasOwnProperty('_boundingRectangle');
   }

   /**
   * set of 'getters' and 'setters' for private variables
   */
   get id (): string {
      return this._id;
   }
   get boundingRectangle (): GRect {
      return this._boundingRectangle;
   }
   get pen(): Pen {
      return this._pen;
   }
   get isSelected(): boolean {
      return this._isSelected;
   }

   set boundingRectangle(rect_: GRect)  {
      this._boundingRectangle = rect_;
   }
   set pen(pen_: Pen) {
      this._pen = pen_;
   }
   set isSelected(isSelected_: boolean)  {
      this._isSelected = isSelected_;
   }

   /**
    * test for equality - checks all fields are the same. 
    * NB must use field values, not identity bcs if objects are streamed to/from JSON, identities will be different. 
    * @param rhs - the object to compare this one to.  
    */
   equals(rhs: Shape): boolean {

      return (this._id === rhs._id &&
         this._boundingRectangle.equals(rhs._boundingRectangle) && 
         this._pen.equals (rhs._pen) &&
         this._isSelected === rhs._isSelected);
   }

   /**
    * assignment operator 
    * @param rhs - the object to assign this one from.  
    */
   assign(rhs: Shape): Shape {

      this._id = rhs._id;
      this._boundingRectangle = new GRect (rhs._boundingRectangle);
      this._pen = new Pen (rhs._pen);
      this._isSelected = rhs._isSelected;

      return this;
   }

   streamToJSON(): string {

      return JSON.stringify({ id: this._id, boundingRectangle: this._boundingRectangle, pen: this._pen.streamToJSON(), isSelected: this._isSelected });
   }

   streamFromJSON(stream: string): void {

      const obj = JSON.parse(stream);

      let pen = new Pen();
      pen.streamFromJSON(obj.pen);

      this.assign(new Shape(obj.id, obj.boundingRectangle, pen, obj.isSelected));
   }

   shapeID(): string {
      return shapeID;
   }

   static shapeID(): string {
      return shapeID;
   }

   static factoryFn(): Shape {
      return new Shape();
   }

   isNull(): boolean {
      return this.equals(Shape.nullShape());
   }

   static isNull(rhs: Shape): boolean {
      return rhs.equals(Shape.nullShape());
   }

   static nullShape(): Shape {
      return new Shape(nullShapeUuid, new GRect(0, 0, 0, 0), new Pen (PenColour.Invisible, PenStyle.None), false);
   }

   static createInstance(): Shape {
      return new Shape();
   }

   static _factoryForShape: ShapeFactory = new ShapeFactory(shapeID, Shape.createInstance);
}

export class SelectionRectangle extends Shape {

   /**
    * Create a SelectionRectangle object
    * @param boundingRectangle_ - boundingRectangle
    */
   public constructor(boundingRectangle_: GRect)

   /**
    * Create a Rectangle object
    * @param rectangle_ - object to copy 
    */
   public constructor(rectangle_: Rectangle)

   /**
    * Create an empty Rectangle object - required for particiation in serialisation framework
    */
   constructor();

   constructor(...arr: any[]) {

      if (arr.length === 1) { // Construct from individual parameters
         if (Shape.isMyType(arr[0]))
            super(arr[0]);
         else
            super(arr[0], new Pen (PenColour.Border, PenStyle.Dashed), false);
         return;
      }
      else {
         super(new GRect(), new Pen (PenColour.Border, PenStyle.Dashed), false);
      }
   }

   // Unique ID that is used to look up the associated renderer
   shapeID(): string {
      return selectionRectangleID;
   }

   static selectionRectangleID(): string {
      return selectionRectangleID;
   }

   static createInstance(): SelectionRectangle {
      return new SelectionRectangle();
   }

   static _factoryForSelectionRectangle : ShapeFactory = new ShapeFactory(selectionRectangleID, Shape.createInstance);
}

export class Rectangle extends Shape {

   /**
    * Create a Rectangle object
    * @param boundingRectangle_ - boundingRectangle
    * @param pen_ - pen
    * @param isSelected_ - true if object is selected and needs to draw and hit-test grab handles
    */
   public constructor(boundingRectangle_: GRect, pen_: Pen, isSelected_: boolean)

   /**
    * Create a Rectangle object
    * @param rectangle_ - object to copy 
    */
   public constructor(rectangle_: Rectangle)

   /**
    * Create an empty Rectangle object - required for particiation in serialisation framework
    */
   constructor();

   constructor(...arr: any[]) {

      if (arr.length === 3) { // Construct from individual coordinates
         super(arr[0], arr[1], arr[2]);
         return;
      }
      else
      if (arr.length === 1) {
         super(arr[0]);
      }
      else {
         super();
      }
   }

   // Unique ID that is used to look up the associated renderer
   shapeID(): string {
      return rectangleID;
   }

   static rectangleID(): string {
      return rectangleID;
   }

   static createInstance(): Rectangle {
      return new Rectangle();
   }

   static _factoryForRectangle: ShapeFactory = new ShapeFactory(rectangleID, Rectangle.createInstance);
}