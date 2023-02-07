/*! Copyright TXPCo 2022 */

// React
import React, { MouseEvent, useState, useRef, useEffect } from 'react';

import { GPoint, GRect } from './Geometry';
import { Shape, ShapeBorderColour, ShapeBorderStyle, Rectangle } from './Shape';

// Scaling Constants for Canvas
const canvasWidth = 1920; 
const canvasHeight = 1080;

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
      ctx.save();

      ctx.strokeStyle = "#393D47";
      shapes.forEach((shape: Shape, key: string) => { 
         ctx.beginPath();
         ctx.rect(shape.boundingRectangle.x, shape.boundingRectangle.y, shape.boundingRectangle.dx, shape.boundingRectangle.dy);
         ctx.stroke();
      });

      ctx.restore();

      resolve();
   });

   return promise;
}

function drawSelectionRect(ctx: CanvasRenderingContext2D,
   selectionStart: GPoint, selectionEnd: GPoint)
   : Promise<void> {
   var promise: Promise<void>;

   promise = new Promise<void>((resolve, reject) => {
      ctx.save();

      ctx.strokeStyle = "#393D47";
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.rect(selectionStart.x, selectionStart.y, selectionEnd.x - selectionStart.x, selectionEnd.y - selectionStart.y);
      ctx.stroke(); 

      ctx.restore();

      resolve();
   });

   return promise;
};

class CanvasState {

   _width: number;
   _height: number;
   _inSelect: boolean;
   _selectionStart: GPoint;
   _selectionEnd: GPoint;
   _shapes: Map<string, Shape>;

   constructor(width_: number, height_: number) {
      this._width = width_;
      this._height = height_;
      this._inSelect = false;
      this._selectionStart = new GPoint(0, 0);
      this._selectionEnd = new GPoint(0, 0);

      this._shapes = new Map<string, Shape>();

      // DEBUG CODE 
      var rect: GRect = new GRect(50, 50, 100, 100);

      var shape: Rectangle = new Rectangle(rect, ShapeBorderColour.Black, ShapeBorderStyle.Solid, false);

      rect = new GRect(50, 50, 100, 100);
      shape = new Rectangle(rect, ShapeBorderColour.Black, ShapeBorderStyle.Solid, false);
      this._shapes.set(shape.id, shape);

      rect = new GRect(150, 150, 100, 100);
      shape = new Rectangle(rect, ShapeBorderColour.Black, ShapeBorderStyle.Solid, false);
      this._shapes.set(shape.id, shape);
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
         if (canvasState._inSelect) {
            drawSelectionRect(ctx, canvasState._selectionStart, canvasState._selectionEnd);
         } 
      });
   });

   return [canvasState, setCanvasState];
}

export interface ICanvasProps {

}

export const Canvas = (props: ICanvasProps) => {

   const canvasRef = useRef(null);
   const [canvasState, setCanvasState] = useCanvas(canvasRef);

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

      // Do hit testing for object selection here
   };

   const handleCanvasMouseDown = (event: MouseEvent): void => {

      event.preventDefault();
      event.stopPropagation();

      var coord: GPoint = getMousePosition(getCanvas(event), event);

      setCanvasState({
         _inSelect: true, _selectionStart: coord, _selectionEnd: coord,
         _width: canvasState._width, _height: canvasState._height, 
         _shapes: canvasState._shapes
      });

   };

   const handleCanvasMouseMove= (event: MouseEvent): void => {

      event.preventDefault();
      event.stopPropagation();

      if (canvasState._inSelect) {
         var coord: GPoint = getMousePosition(getCanvas(event), event);

         setCanvasState({
            _inSelect: true, _selectionStart: canvasState._selectionStart, _selectionEnd: coord,
            _width: canvasState._width, _height: canvasState._height,
            _shapes: canvasState._shapes
         });
      }
   };

   const handleCanvasMouseUp = (event: MouseEvent): void => {

      event.preventDefault();
      event.stopPropagation();

      if (canvasState._inSelect) {
         var coord: GPoint = getMousePosition(getCanvas(event), event);

         setCanvasState({
            _inSelect: false, _selectionStart: canvasState._selectionStart, _selectionEnd: coord,
            _width: canvasState._width, _height: canvasState._height,
            _shapes: canvasState._shapes
         });
      }
   };

   return (<canvas
      className="App-canvas"
      ref={canvasRef as any}
      width={canvasWidth as any}
      height={canvasHeight as any}
      onClick={handleCanvasClick}
      onMouseDown={handleCanvasMouseDown}
      onMouseMove={handleCanvasMouseMove}
      onMouseUp={handleCanvasMouseUp}
   />);
}
