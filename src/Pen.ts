// Copyright (c) 2023 TXPCo Ltd

import { InvalidParameterError } from './Errors';
import { MSerialisable } from "./SerialisationFramework";

export enum PenColour { Red = "Red", Blue = "Blue", Green = "Green", Black = "Black", Border = "Border", Invisible="Invisible"};
export enum PenStyle { Solid="Solid", Dashed="Dashed", Dotted="Dotted", None="None"}; 

export class Pen extends MSerialisable {

   _colour: PenColour;
   _style: PenStyle;

   /**
    * Create a Pen object
    * @param colour_ - colour
    * @param style_ - style
    */
   public constructor(colour_: PenColour, ctyle_: PenStyle)

   /**
    * Create a Pen object
    * @param pen_ - object to copy 
    */
   public constructor(pen_: Pen)

   /**
    * Create an empty Pen object - required for particiation in serialisation framework
    */
   constructor();

   constructor(...arr: any[]) {

      super();

      if (arr.length === 2) { // Construct from individual parameters 
         this._colour = arr[0];
         this._style = arr[1]
         return;
      }
      else
      if (arr.length === 1) {
         if (Pen.isMyType(arr[0])) { // Copy Constructor
            this._colour = arr[0]._colour;
            this._style = arr[0]._style;
            return;
         }
         else {
            throw new InvalidParameterError("Cannot construct Pen from unknown type.")
         }
      }
      else
      if (arr.length === 0) { // Empty Constructor
         this._colour = PenColour.Black;
         this._style = PenStyle.Solid;
      }
   }

   protected static isMyType(rhs: Pen): boolean {
      return rhs && rhs.hasOwnProperty('_style') && rhs.hasOwnProperty('_colour');
   }

   /**
   * set of 'getters' and 'setters' for private variables
   */
   get colour(): PenColour {
      return this._colour;
   }
   get style(): PenStyle {
      return this._style;
   }
   set colour(colour_: PenColour) {
      this._colour = colour_;
   }
   set style(style_: PenStyle)  {
      this._style = style_;
   }

   /**
    * test for equality - checks all fields are the same. 
    * NB must use field values, not identity bcs if objects are streamed to/from JSON, identities will be different. 
    * @param rhs - the object to compare this one to.  
    */
   equals(rhs: Pen): boolean {

      return (
         this._colour === rhs._colour &&
         this._style === rhs._style );
   }

   /**
    * assignment operator 
    * @param rhs - the object to assign this one from.  
    */
   assign(rhs: Pen): Pen {

      this._colour = rhs._colour;
      this._style = rhs._style;

      return this;
   }

   streamToJSON(): string {

      return JSON.stringify({ colour: this._colour, style: this._style});
   }

   streamFromJSON(stream: string): void {

      const obj = JSON.parse(stream);

      let typedColour: PenColour = PenColour[obj.colour as keyof typeof PenColour];

      let typedStyle: PenStyle = PenStyle[obj.style as keyof typeof PenStyle]; 

      this.assign(new Pen(typedColour, typedStyle));
   }
}

