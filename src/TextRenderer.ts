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

   draw(ctx: CanvasRenderingContext2D,
      shape: Shape): void {

      var textShape: TextShape = shape as TextShape;

      ctx.save();
      //ctx.textAlign = 'center';
      //ctx.textBaseline = 'middle';
      ctx.strokeStyle = "#393D47";
      ctx.fillStyle = "#393D47";
      ctx.font = "26px sans-serif";

      //ctx.beginPath();
      //ctx.rect(shape.boundingRectangle.x, shape.boundingRectangle.y, shape.boundingRectangle.dx, shape.boundingRectangle.dy);
      //ctx.clip();

      //ctx.beginPath();
      ctx.fillText(textShape.text,
         textShape.boundingRectangle.x,
         textShape.boundingRectangle.y,
         textShape.boundingRectangle.dx);
      //ctx.fill();

      ctx.restore();

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
