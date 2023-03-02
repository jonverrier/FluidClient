// Copyright (c) 2023 TXPCo Ltd

import { Shape } from "./Shape";
import { IShapeInteractor } from "./ShapeInteractor"; 
import { ShapeRenderer, ShapeRendererFactory } from "./ShapeRenderer"; 
import { Rectangle, SelectionRectangle } from "./Rectangle";
import { TextShape } from './Text';

/// <summary>
/// SelectionRectangleRenderer - draws Rectangle shapes
/// <summary>
export class SelectionRectangleRenderer extends ShapeRenderer {

   /**
    * Create an empty SelectionRectangleRenderer object 
    */
   constructor() {

      super();
   }

   draw(ctx: CanvasRenderingContext2D,
      shape: Shape): void {

      this.drawBorder(ctx, shape);
   }

   static createInstance(): RectangleShapeRenderer {
      return new RectangleShapeRenderer();
   }

   private static _factoryForSelectionRectangle: ShapeRendererFactory = new ShapeRendererFactory(SelectionRectangle.selectionRectangleID(),
      SelectionRectangleRenderer.createInstance);
}

/// <summary>
/// RectangleShapeRenderer - draws Rectangle shapes
/// <summary>
export class RectangleShapeRenderer extends ShapeRenderer {

   /**
    * Create an empty RectangleShapeRenderer object 
    */
   constructor() {

      super();
   }

   draw(ctx: CanvasRenderingContext2D,
      shape: Shape): void {

      this.drawBorder(ctx, shape);

      if (shape.isSelected) {
         this.drawSelectionBorder(ctx, shape, IShapeInteractor.defaultGrabHandleDxDy());
      }
   }

   static createInstance(): RectangleShapeRenderer {
      return new RectangleShapeRenderer();
   }

   // Caucus may contain a 'Shape' element while going through handshake process - we write a null shape on joining to kick start it
   private static _factoryForShape: ShapeRendererFactory = new ShapeRendererFactory(Shape.shapeID(),
                                                                                    RectangleShapeRenderer.createInstance);
   private static _factoryForRectangle: ShapeRendererFactory = new ShapeRendererFactory(Rectangle.rectangleID(),
                                                                                        RectangleShapeRenderer.createInstance);
}
