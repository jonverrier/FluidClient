// Copyright (c) 2023 TXPCo Ltd

import { InvalidParameterError } from './Errors';
import { uuid } from './Uuid';
import { MSerialisable } from "./SerialisationFramework";
import { GRect } from "./Geometry";

export enum ShapeBorderColour { Red="Red", Blue="Blue", Green="Green", Black="Black", Border = "Border"};
export enum ShapeBorderStyle { Solid="Solid", Dashed="Dashed", Dotted="Dotted" }; 

export class Shape extends MSerialisable {

   _id: string;
   _boundingRectangle: GRect;
   _borderColour: ShapeBorderColour;
   _borderStyle: ShapeBorderStyle;
   _isSelected: boolean;

   /**
    * Create a Shape object
    * @param boundingRectangle_ - boundingRectangle
    * @param borderColour_ - colour
    * @param borderStyle_ - style
    * @param isSelected_ - true if object is selected and needs to draw and hit-test grab handles
    */
   public constructor(boundingRectangle_: GRect, borderColour_: ShapeBorderColour, borderStyle_: ShapeBorderStyle, isSelected_: boolean)

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

      this._id = uuid();

      if (arr.length === 4) { // Construct from individual coordinates
         this._boundingRectangle = new GRect (arr[0]);
         this._borderColour = arr[1];
         this._borderStyle = arr[2]
         this._isSelected = arr[3];
         return;
      }
      else
      if (arr.length === 1) {
         if (Shape.isMyType(arr[0])) { // Copy Constructor
            this._boundingRectangle = new GRect(arr[0]._boundingRectangle);
            this._borderColour = arr[0]._borderColour;
            this._borderStyle = arr[0]._borderStyle;
            this._isSelected = arr[0]._isSelected;
            return;
         }
         else {
            throw new InvalidParameterError("Cannot construct Shape from unknown type.")
         }
      }
      else
      if (arr.length === 0) { // Empty Constructor
         this._boundingRectangle = new GRect;
         this._borderColour = ShapeBorderColour.Black;
         this._borderStyle = ShapeBorderStyle.Solid;
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
   get borderColour(): ShapeBorderColour {
      return this._borderColour;
   }
   get borderStyle(): ShapeBorderStyle {
      return this._borderStyle;
   }
   get isSelected(): boolean {
      return this._isSelected;
   }

   set boundingRectangle(rect_: GRect)  {
      this._boundingRectangle = rect_;
   }
   set borderColour(borderColour_: ShapeBorderColour) {
      this._borderColour = borderColour_;
   }
   set borderStyle(borderStyle_: ShapeBorderStyle)  {
      this._borderStyle = borderStyle_;
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

      return (this._boundingRectangle.equals(rhs._boundingRectangle) && 
         this._borderColour === rhs._borderColour &&
         this._borderStyle === rhs._borderStyle &&
         this._isSelected === rhs._isSelected);
   }

   /**
    * assignment operator 
    * @param rhs - the object to assign this one from.  
    */
   assign(rhs: Shape): Shape {

      this._boundingRectangle = new GRect (rhs._boundingRectangle);
      this._borderColour = rhs._borderColour;
      this._borderStyle = rhs._borderStyle;
      this._isSelected = rhs._isSelected;

      return this;
   }

   streamToJSON(): string {

      return JSON.stringify({ boundingRectangle: this._boundingRectangle, borderColour: this._borderColour, borderStyle: this._borderStyle, isSelected: this._isSelected });
   }

   streamFromJSON(stream: string): void {

      const obj = JSON.parse(stream);

      let typedColour: ShapeBorderColour = ShapeBorderColour[obj.borderColour as keyof typeof ShapeBorderColour];

      let typedStyle: ShapeBorderStyle = ShapeBorderStyle[obj.borderStyle as keyof typeof ShapeBorderStyle]; 

      this.assign(new Shape(obj.boundingRectangle, typedColour, typedStyle, obj.isSelected));
   }

   shapeID(): string {
      return "Shape";
   }

   // TO DO - will need a way to virtually construct derived types. 
   static factoryFn(): Shape {
      return new Shape();
   }

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

      if (arr.length === 1) { // Construct from individual coordinates
         if (Shape.isMyType(arr[0]))
            super(arr[0]);
         else
            super(arr[0], ShapeBorderColour.Border, ShapeBorderStyle.Dashed, false);
         return;
      }
      else {
         super(new GRect(), ShapeBorderColour.Border, ShapeBorderStyle.Dashed, false);
      }
   }

   // Unique ID that is used to look up the associated renderer
   shapeID(): string {
      return "SelectionRectangle";
   }

}

export class Rectangle extends Shape {

   /**
    * Create a Rectangle object
    * @param boundingRectangle_ - boundingRectangle
    * @param borderColour_ - colour
    * @param borderStyle_ - style
    * @param isSelected_ - true if object is selected and needs to draw and hit-test grab handles
    */
   public constructor(boundingRectangle_: GRect, borderColour_: ShapeBorderColour, borderStyle_: ShapeBorderStyle, isSelected_: boolean)

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

      if (arr.length === 4) { // Construct from individual coordinates
         super(arr[0], arr[1], arr[2], arr[3]);
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
      return "Rectangle";
   }
}