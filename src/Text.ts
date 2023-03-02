// Copyright (c) 2023 TXPCo Ltd

import { GRect } from './GeometryRectangle';
import { Pen, PenColour, PenStyle } from "./Pen";
import { MDynamicStreamable, DynamicStreamableFactory } from './StreamingFramework';
import { Shape, ShapeFactory } from './Shape';

const textID: string = "Text";

export class TextShape extends Shape {

   private _text: string;

   /**
    * Create a TextShape object
    * @param text_ - the text to display* 
    * @param boundingRectangle_ - boundingRectangle
    * @param pen_ - pen
    * @param isSelected_ - true if object is selected and needs to draw and hit-test grab handles
    */
   public constructor(text_: string, boundingRectangle_: GRect, pen_: Pen, isSelected_: boolean)

   /**
    * Create a TextShape object
    * @param text_ - object to copy 
    */
   public constructor(text_: TextShape)

   /**
    * Create an empty TextShape object - required for particiation in serialisation framework
    */
   constructor();

   constructor(...arr: any[]) {

      if (arr.length === 4) { // Construct from individual components
         super(arr[1], arr[2], arr[3]);
         this._text = arr[0];
         return;
      }
      else
      if (arr.length === 1) { // Copy constructor
         super(arr[0]);
         this._text = arr[0]._text;
      }
      else {
         super();
      }
   }

   /**
   * set of 'getters' and 'setters' for private variables
   */
   get text(): string {
      return this._text;
   }

   // Unique ID that is used to look up the associated renderer
   shapeID(): string {
      return textID;
   }

   /**
    * Dynamic creation for Streaming framework
    */
   className(): string {

      return textID;
   }

   /**
    * test for equality - checks all fields are the same. 
    * NB must use field values, not identity bcs if objects are streamed to/from JSON, identities will be different. 
    * @param rhs - the object to compare this one to.  
    */
   equals(rhs: TextShape): boolean {

      return (this._text === rhs._text &&
         super.equals(rhs));
   }

   /**
    * assignment operator 
    * @param rhs - the object to assign this one from.  
    */
   assign(rhs: TextShape): TextShape {

      super.assign(rhs); 
      this._text = rhs._text;

      return this;
   }

   static createDynamicInstance(): MDynamicStreamable {
      return new TextShape();
   }

   static _dynamicStreamableFactory: DynamicStreamableFactory = new DynamicStreamableFactory(textID, TextShape.createDynamicInstance);

   streamOut(): string {

      return JSON.stringify({ shapeID: this.shapeID(), text: this._text, id: this._id, boundingRectangle: this._boundingRectangle, pen: this._pen.streamOut(), isSelected: this._isSelected });
   }

   streamIn(stream: string): void {

      const obj = JSON.parse(stream);

      let pen = new Pen();
      pen.streamIn(obj.pen);

      this._id = obj.id;
      this._text = obj.text;
      this._boundingRectangle = new GRect(obj.boundingRectangle);
      this._pen = pen;
      this._isSelected = obj.isSelected;
   }

   static textID(): string {
      return textID;
   }

   static createInstance(): TextShape {
      return new TextShape();
   }

   static _factoryForText: ShapeFactory = new ShapeFactory(textID,
      TextShape.createInstance);
}