// Copyright (c) 2023 TXPCo Ltd

import { Shape } from "./Shape";
import { IShapeInteractor } from "./ShapeInteractor"; 
import { ShapeRenderer, ShapeRendererFactory } from "./ShapeRenderer"; 
import { TextShape } from './Text';

/// <summary>
/// TextShapeRenderer - draws Line shapes
/// <summary>
export class TextShapeRenderer extends ShapeRenderer {

   /**
    * Create an empty TextShapeRenderer object 
    */
   constructor() {

      super();
   }

   // http://www.html5canvastutorials.com/tutorials/html5-canvas-wrap-text-tutorial/
   wrapText(context: CanvasRenderingContext2D, text: string,
      x: number, y: number, maxWidth: number, lineHeight: number): void {

      var cars = text.split("\n");

      for (var ii = 0; ii < cars.length; ii++) {

         var line = "";
         var words = cars[ii].split(" ");

         for (var n = 0; n < words.length; n++) {
            var testLine = line + words[n] + " ";
            var metrics = context.measureText(testLine);
            var testWidth = metrics.width;

            if (testWidth > maxWidth) {
               context.fillText(line, x, y);
               line = words[n] + " ";
               y += lineHeight;
            }
            else {
               line = testLine;
            }
         }
      }

      context.fillText(line, x, y);
      y += lineHeight;
   }

   draw(ctx: CanvasRenderingContext2D,
      shape: Shape): void {

      var textShape: TextShape = shape as TextShape;

      this.setPen(ctx, shape. pen);

      this.wrapText(ctx, textShape.text,
         textShape.boundingRectangle.x, textShape.boundingRectangle.y, textShape.boundingRectangle.dx,
         (ctx as any).lineHeight); // The canvas puts this on as an extra variable

      if (shape.isSelected) {
         this.drawSelectionBorder(ctx, shape, IShapeInteractor.defaultGrabHandleDxDy());
      }

   }

   static createInstance(): TextShapeRenderer {
      return new TextShapeRenderer();
   }

   private static _factoryForText: ShapeRendererFactory = new ShapeRendererFactory(TextShape.textID(),
                                                                                   TextShapeRenderer.createInstance);
}
