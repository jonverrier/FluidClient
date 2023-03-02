// Copyright (c) 2023 TXPCo Ltd

import { GRect } from './GeometryRectangle';
import { Pen, PenColour, PenStyle } from "./Pen";
import { MDynamicStreamable, DynamicStreamableFactory } from './StreamingFramework';
import { Shape, ShapeFactory } from './Shape';

const selectionRectangleID: string = "SelectionRectangle";
const rectangleID: string = "Rectangle";

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

   static _factoryForSelectionRectangle: ShapeFactory = new ShapeFactory(selectionRectangleID,
                                                                         SelectionRectangle.createInstance);
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

   /**
    * Dynamic creation for Streaming framework
    */
   className(): string {

      return rectangleID;
   }

   static createDynamicInstance(): MDynamicStreamable {
      return new Rectangle();
   }

   static _dynamicStreamableFactory: DynamicStreamableFactory = new DynamicStreamableFactory(rectangleID, Rectangle.createDynamicInstance);

   streamOut(): string {

      return JSON.stringify({ shapeID: this.shapeID(), id: this._id, boundingRectangle: this._boundingRectangle, pen: this._pen.streamOut(), isSelected: this._isSelected });
   }

   static rectangleID(): string {
      return rectangleID;
   }

   static createInstance(): Rectangle {
      return new Rectangle();
   }

   static _factoryForRectangle: ShapeFactory = new ShapeFactory(rectangleID,
                                                                Rectangle.createInstance);
}