/*! Copyright TXPCo 2022 */

// React
import React, { MouseEvent, useState, useRef, useEffect } from 'react';

// Other 3rd party imports
import { log, tag } from 'missionlog';

export interface ICanvasProps {

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
   img.onload = () => {
      for (var j = 0; j < ctx.canvas.height; j += img.height) {
         for (var i = 0; i < ctx.canvas.width; i += img.width) {
            ctx.drawImage(img, i, j);
         }
      }
   }

   return;
};

function draw(ctx: CanvasRenderingContext2D, location: Coordinate) : void {

   ctx.fillStyle = 'red';
   ctx.shadowColor = 'blue';
   ctx.shadowBlur = 15;

   ctx.save();
   ctx.scale(SCALE, SCALE);
   ctx.translate(location.x / SCALE - OFFSETX, location.y / SCALE - OFFSETY);
   ctx.rotate(225 * Math.PI / 180);
   ctx.fill(SVG_PATH);
   ctx.restore();
};

class Coordinate {

   x: number;
   y: number;

   constructor(x_: number, y_: number) {
      this.x = x_;
      this.y = y_;
   }
}

class CanvasState {

   width: number;
   height: number;
   coords: Array<Coordinate>;

   constructor(coords_: Array<Coordinate>, width_: number, height_: number) {
      this.coords = coords_;
      this.width = width_;
      this.height = height_;
   }
}

function useCanvas(ref: React.MutableRefObject<any>): [CanvasState, React.Dispatch<React.SetStateAction<CanvasState>>] {

   const [canvasState, setCanvasState] = useState<CanvasState> (new CanvasState(new Array<Coordinate>, canvasWidth, canvasHeight));

   useEffect(() => {
      const canvasObj = ref.current;
      const ctx = canvasObj.getContext('2d');

      // draw background first
      drawBackground(ctx);

      // draw all coordinates held in state
      // canvasState.coords.forEach((coordinate: Coordinate) => { draw(ctx, coordinate) });
   });

   return [canvasState, setCanvasState];
}

export const Canvas = (props: ICanvasProps) => {

   const canvasRef = useRef(null);
   const [canvasState, setCanvasState] = useCanvas(canvasRef);

   const handleCanvasClick = (event: MouseEvent) : void => {

      // on each click get current mouse location & append
      const newCoord = { x: event.clientX, y: event.clientY };

      var newCoordinates = new Array<Coordinate>();
      newCoordinates = canvasState.coords.splice(0);
      newCoordinates.push(newCoord);

      setCanvasState ({ coords: newCoordinates, width: canvasState.width, height: canvasState.height });
   };

   return (<canvas
      className="App-canvas"
      ref={canvasRef as any}
      width={canvasWidth as any}
      height={canvasHeight as any}
      onClick = { handleCanvasClick }
   />);
}
