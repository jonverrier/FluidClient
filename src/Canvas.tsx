/*! Copyright TXPCo 2022 */

// React
import React, { MouseEvent, useState, useRef, useEffect } from 'react';

// Fluent
import {
   makeStyles
} from '@fluentui/react-components';

// Local
import { GPoint, GRect } from './Geometry';
import { Interest, NotificationFor, ObserverInterest, NotificationRouterFor } from './NotificationFramework';
import { Shape, ShapeBorderColour, ShapeBorderStyle, Rectangle } from './Shape';
import { CanvasMode } from './CanvasModes';
import { ShapeInteractor, shapeInteractionCompleteInterest } from './CanvasInteractors';
import { ShapeRendererFactory } from './ShapeRenderer';

// Scaling Constants for Canvas
const canvasWidth = 1920; 
const canvasHeight = 1080;

const cursorDefaultStyles = makeStyles({
   root: {
      cursor: 'default'
   },
});

const cursorDrawRectangleStyles = makeStyles({
   root: {
      cursor: 'crosshair'
   },
});

function drawBackground (ctx: CanvasRenderingContext2D): Promise<void> {

   let img = new Image(512, 384);
   img.src = 'assets/img/board-512x384.png';

   // tesselate with backround image top to bottom, left to right
   function innerDraw (ctx: CanvasRenderingContext2D) {
      for (var j = 0; j < ctx.canvas.height; j += img.height) {
         for (var i = 0; i < ctx.canvas.width; i += img.width) {
            ctx.drawImage(img, i, j);
         }
      }
   }
   var promise: Promise<void>;

   promise = new Promise<void>((resolve, reject) => {

      img.onload = () => {
         innerDraw(ctx);
         resolve();
      }
   });

   return promise;
};

function drawShapes (ctx: CanvasRenderingContext2D,
   shapes : Map<string, Rectangle>)
   : Promise<void> {
   var promise: Promise<void>;

   promise = new Promise<void>((resolve, reject) => {

      shapes.forEach((shape: Shape, key: string) => { 

         let renderer = ShapeRendererFactory.create(shape.shapeID());

         renderer.draw(ctx, shape);
      });

      resolve();
   });

   return promise;
}

function drawSelectionRect(ctx: CanvasRenderingContext2D,
   selectionRect: GRect)
   : Promise<void> {
   var promise: Promise<void>;

   promise = new Promise<void>((resolve, reject) => {

      var border: Shape = new Shape(selectionRect, ShapeBorderColour.Border, ShapeBorderStyle.Dashed, false);

      ctx.save();

      ctx.strokeStyle = "#393D47";
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.rect(selectionRect.x, selectionRect.y, selectionRect.dx, selectionRect.dy);
      ctx.stroke(); 

      ctx.restore();

      resolve();
   });

   return promise;
};

class CanvasState {

   _width: number;
   _height: number;
   _shapes: Map<string, Shape>;
   _shapeInteractor: ShapeInteractor;
   _notificationRouter: NotificationRouterFor<GRect>;

   constructor(width_: number, height_: number) {
      this._width = width_;
      this._height = height_;

      this._shapes = new Map<string, Shape>();
      this._shapeInteractor = null;
      this._notificationRouter = null;
   }
}

function useCanvas(ref: React.MutableRefObject<any>): [CanvasState, React.Dispatch<React.SetStateAction<CanvasState>>] {

   const [canvasState, setCanvasState] = useState<CanvasState> (new CanvasState(canvasWidth, canvasHeight));

   useEffect(() => {
      const canvasObj = ref.current;
      const ctx = canvasObj.getContext('2d');

      // draw background first
      drawBackground(ctx).then(() => {

         // then shapes
         drawShapes(ctx, canvasState._shapes);

      }).then (() => {

         // then draw selection rectangle
         if (canvasState._shapeInteractor) {
            drawSelectionRect(ctx, canvasState._shapeInteractor.rectangle);
         } 
      });
   });

   return [canvasState, setCanvasState];
}

export interface ICanvasProps {

   mode: CanvasMode;
}

function shapeInteractorFromMode(mode_: CanvasMode, bounds_: GRect): ShapeInteractor {
   switch (mode_) {
      case CanvasMode.Rectangle:
         return new ShapeInteractor (bounds_);

      case CanvasMode.Select:
         return new ShapeInteractor(bounds_);

      default:
         return null;
   }
}

export const Canvas = (props: ICanvasProps) => {

   const canvasRef = useRef(null);
   const [canvasState, setCanvasState] = useCanvas(canvasRef);

   const cursorDefaultClasses = cursorDefaultStyles();
   const cursorDrawRectangleClasses = cursorDrawRectangleStyles();

   function cursorStylesFromMode(mode_: CanvasMode): string {
      switch (mode_) {
         case CanvasMode.Rectangle:
            return cursorDrawRectangleClasses.root;

         default:
            return cursorDefaultClasses.root;
      }
   }

   function getCanvas(event: MouseEvent): HTMLCanvasElement {

      var target: HTMLCanvasElement;

      if (event.target)
         target = event.target as HTMLCanvasElement;

      return target;
   }

   function getMousePosition(canvas: HTMLCanvasElement, event: MouseEvent): GPoint {

      let rect = canvas.getBoundingClientRect();
      let x = event.clientX - rect.left;
      let y = event.clientY - rect.top;

      return new GPoint(x, y);
   }

   const handleCanvasClick = (event: MouseEvent) : void => {

      event.preventDefault();
      event.stopPropagation();

      return; 
   };

   function onShapeInteractionComplete(interest: Interest, data: NotificationFor<GRect>) {

      switch (props.mode) { 
         case CanvasMode.Rectangle:
            // Clear previous selections
            canvasState._shapes.forEach((shape: Shape, key: string) => {
               shape.isSelected = false;
            });
            // Create new shape - selected
            let shape = new Rectangle(data.eventData, ShapeBorderColour.Black, ShapeBorderStyle.Solid, true);
            canvasState._shapes.set(shape.id, shape);
            break;
         case CanvasMode.Select:
         default:
            // Select items within the selection area
            canvasState._shapes.forEach((shape: Shape, key: string) => {
               if (data.eventData.fullyIncludes(shape.boundingRectangle)) {
                  shape.isSelected = true;
               }
               else {
                  shape.isSelected = false;
               }
            });
            break;
   }
   }

   const handleCanvasMouseDown = (event: MouseEvent): void => {

      event.preventDefault();
      event.stopPropagation();

      var coord: GPoint = getMousePosition(getCanvas(event), event);

      let canvas = getCanvas(event);
      let clientRect = canvas.getBoundingClientRect();
      let bounds = new GRect(0, 0, clientRect.right - clientRect.left, clientRect.bottom - clientRect.top);


      // Create the right interactor, and hook up to notifications of when the interaction is complete
      let shapeInteractor = shapeInteractorFromMode(props.mode, bounds);
      shapeInteractor.mouseDown(coord);

      var notificationRouter: NotificationRouterFor<GRect> = new NotificationRouterFor<GRect>(onShapeInteractionComplete.bind(this)); 
      shapeInteractor.addObserver(new ObserverInterest(notificationRouter, shapeInteractionCompleteInterest));

      setCanvasState({
         _width: canvasState._width, _height: canvasState._height,
         _shapes: canvasState._shapes,
         _shapeInteractor: shapeInteractor,
         _notificationRouter: notificationRouter
      });

   };

   const handleCanvasMouseMove= (event: MouseEvent): void => {

      event.preventDefault();
      event.stopPropagation();

      if (canvasState._shapeInteractor) {
         var coord: GPoint = getMousePosition(getCanvas(event), event);

         canvasState._shapeInteractor.mouseMove(coord);

         setCanvasState({
            _width: canvasState._width, _height: canvasState._height,
            _shapes: canvasState._shapes,
            _shapeInteractor: canvasState._shapeInteractor,
            _notificationRouter: canvasState._notificationRouter
         });
      }
   };

   const handleCanvasMouseUp = (event: MouseEvent): void => {

      event.preventDefault();
      event.stopPropagation();

      if (canvasState._shapeInteractor) {
         var coord: GPoint = getMousePosition(getCanvas(event), event);

         canvasState._shapeInteractor.mouseUp(coord);

         setCanvasState({
            _width: canvasState._width, _height: canvasState._height,
            _shapes: canvasState._shapes,
            _shapeInteractor: null,
            _notificationRouter: null
         });
      }
   };

   return (<div className={cursorStylesFromMode(props.mode)}>
      <canvas
      className="App-canvas"
      ref={canvasRef as any}
      width={canvasWidth as any}
      height={canvasHeight as any}
      onClick={handleCanvasClick}
      onMouseDown={handleCanvasMouseDown}
      onMouseMove={handleCanvasMouseMove}
      onMouseUp={handleCanvasMouseUp}
   /></div>);
}
