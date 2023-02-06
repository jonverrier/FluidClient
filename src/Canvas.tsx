/*! Copyright TXPCo 2022 */

// React
import React, { MouseEvent, useState, useRef, useEffect } from 'react';

// Other 3rd party imports
import { log, tag } from 'missionlog';

class Coordinate {

   x: number;
   y: number;

   constructor(x_: number, y_: number) {
      this.x = x_;
      this.y = y_;
   }
}

// Path2D for a Heart SVG
const heartSVG = "M0 200 v-200 h200 a100,100 90 0,1 0,200 a100,100 90 0,1 -200,0 z"
const SVG_PATH = new Path2D(heartSVG);

// Scaling Constants for Canvas
const SCALE = 0.1;
const OFFSETX = 100;
const OFFSETY = 200;
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

function drawSelectionRect(ctx: CanvasRenderingContext2D,
   selectionStart: Coordinate, selectionEnd: Coordinate)
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

/*
function draw(ctx: CanvasRenderingContext2D, location: Coordinate) : void {

   ctx.save();

   ctx.fillStyle = 'red';
   ctx.shadowColor = 'blue';
   ctx.shadowBlur = 15;

   ctx.scale(SCALE, SCALE);
   ctx.translate(location.x / SCALE - OFFSETX, location.y / SCALE - OFFSETY);
   ctx.rotate(225 * Math.PI / 180);
   ctx.fill(SVG_PATH);

   ctx.restore();
};
*/

class CanvasState {

   _width: number;
   _height: number;
   _inSelect: boolean;
   _selectionStart: Coordinate;
   _selectionEnd: Coordinate;

   constructor(width_: number, height_: number) {
      this._width = width_;
      this._height = height_;
      this._inSelect = false;
      this._selectionStart = new Coordinate(0, 0);
      this._selectionEnd = new Coordinate(0, 0);
   }
}

function useCanvas(ref: React.MutableRefObject<any>): [CanvasState, React.Dispatch<React.SetStateAction<CanvasState>>] {

   const [canvasState, setCanvasState] = useState<CanvasState> (new CanvasState(canvasWidth, canvasHeight));

   useEffect(() => {
      const canvasObj = ref.current;
      const ctx = canvasObj.getContext('2d');

      // draw background first
      drawBackground(ctx).then(() => {
         // would draw shapes here

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

   function getMousePosition(canvas: HTMLCanvasElement, event: MouseEvent): Coordinate {

      let rect = canvas.getBoundingClientRect();
      let x = event.clientX - rect.left;
      let y = event.clientY - rect.top;

      return new Coordinate(x, y);
   }

   const handleCanvasClick = (event: MouseEvent) : void => {

      // Do hit testing for object selection here
   };

   const handleCanvasMouseDown = (event: MouseEvent): void => {

      event.preventDefault();
      event.stopPropagation();

      var coord: Coordinate = getMousePosition(getCanvas(event), event);

      setCanvasState({
         _inSelect: true, _selectionStart: coord, _selectionEnd: coord,
         _width: canvasState._width, _height: canvasState._height
      });

   };

   const handleCanvasMouseMove= (event: MouseEvent): void => {

      event.preventDefault();
      event.stopPropagation();

      if (canvasState._inSelect) {
         var coord: Coordinate = getMousePosition(getCanvas(event), event);

         setCanvasState({
            _inSelect: true, _selectionStart: canvasState._selectionStart, _selectionEnd: coord,
            _width: canvasState._width, _height: canvasState._height
         });
      }
   };

   const handleCanvasMouseUp = (event: MouseEvent): void => {

      event.preventDefault();
      event.stopPropagation();

      if (canvasState._inSelect) {
         var coord: Coordinate = getMousePosition(getCanvas(event), event);

         setCanvasState({
            _inSelect: false, _selectionStart: canvasState._selectionStart, _selectionEnd: coord,
            _width: canvasState._width, _height: canvasState._height
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
