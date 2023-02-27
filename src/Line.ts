// Copyright (c) 2023 TXPCo Ltd

import { GRect } from './GeometryRectangle';
import { Pen, PenColour, PenStyle } from "./Pen";
import { MDynamicStreamable, DynamicStreamableFactory } from './StreamingFramework';
import { Shape, ShapeFactory } from './Shape';

const selectionLineID: string = "SelectionLine";
const lineID: string = "Line";

export class SelectionLine extends Shape {

   /**
    * Create a SelectionLine object
    * @param boundingRectangle_ - boundingRectangle
    */
   public constructor(boundingRectangle_: GRect)

   /**
    * Create a SelectionLine object
    * @param line_ - object to copy 
    */
   public constructor(line_: SelectionLine)

   /**
    * Create an empty Rectangle object - required for particiation in serialisation framework
    */
   constructor();

   constructor(...arr: any[]) {

      if (arr.length === 1) { // Construct from individual parameters
         if (Shape.isMyType(arr[0])) {
            super(arr[0]);
         }
         else {
            super(arr[0], new Pen(PenColour.Border, PenStyle.Dashed), false);
         }
         return;
      }
      else {
         super(new GRect(), new Pen (PenColour.Border, PenStyle.Dashed), false);
      }
   }

   // Unique ID that is used to look up the associated renderer
   shapeID(): string {
      return selectionLineID;
   }

   static selectionLineID(): string {
      return selectionLineID;
   }

   static createInstance(): SelectionLine {
      return new SelectionLine();
   }

   static _factoryForSelectionLine: ShapeFactory = new ShapeFactory(selectionLineID,
                                                                    SelectionLine.createInstance);
}

export class Line extends Shape {

   /**
    * Create a Line object
    * @param boundingRectangle_ - boundingRectangle
    * @param pen_ - pen
    * @param isSelected_ - true if object is selected and needs to draw and hit-test grab handles
    */
   public constructor(boundingRectangle_: GRect, pen_: Pen, isSelected_: boolean)

   /**
    * Create a Line object
    * @param line_ - object to copy 
    */
   public constructor(line_: Line)

   /**
    * Create an empty Line object - required for particiation in serialisation framework
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

   /**
    * Dynamic creation for Streaming framework
    */
   className(): string {

      return lineID;
   }

   static createDynamicInstance(): MDynamicStreamable {
      return new Line();
   }

   static _dynamicStreamableFactory: DynamicStreamableFactory = new DynamicStreamableFactory(lineID, Line.createDynamicInstance);

   // Unique ID that is used to look up the associated renderer
   shapeID(): string {
      return lineID;
   }

   static lineID(): string {
      return lineID;
   }

   static createInstance(): Line {
      return new Line();
   }

   static _factoryForLine: ShapeFactory = new ShapeFactory(lineID,
      Line.createInstance);

}