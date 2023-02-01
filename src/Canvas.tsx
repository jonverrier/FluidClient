/*! Copyright TXPCo 2022 */

// React
import React, { MouseEvent, useState, useRef, useEffect } from 'react';

export interface ICanvasProps {

}

// Path2D for a Heart SVG
const heartSVG = "M0 200 v-200 h200 a100,100 90 0,1 0,200 a100,100 90 0,1 -200,0 z"
const SVG_PATH = new Path2D(heartSVG);

// Scaling Constants for Canvas
const SCALE = 0.1;
const OFFSET = 0;
const canvasWidth = window.innerWidth * .5;
const canvasHeight = window.innerHeight * .5;

function draw(ctx, location: Coordinate) {
   console.log("attempting to draw");
   ctx.fillStyle = 'red';
   ctx.shadowColor = 'blue';
   ctx.shadowBlur = 15;

   ctx.save();
   ctx.scale(SCALE, SCALE);
   ctx.translate(location.x / SCALE - OFFSET, location.y / SCALE - OFFSET);
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

function useCanvas() {

   const canvasRef = useRef(null);
   const [coordinates, setCoordinates] = useState(Array<Coordinate>);

   useEffect(() => {
      const canvasObj = canvasRef.current;
      const ctx = canvasObj.getContext('2d');

      // clear the canvas area before rendering the coordinates held in state
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      // draw all coordinates held in state
      coordinates.forEach((coordinate: Coordinate) => { draw(ctx, coordinate) });
   });

   return [coordinates, setCoordinates, canvasRef, canvasWidth, canvasHeight];
}

export const Canvas = (props: ICanvasProps) => {

   const [coordinates, setCoordinates, canvasRef, canvasWidth, canvasHeight] = useCanvas();

   const handleCanvasClick = (event: MouseEvent) : void => {

      // on each click get current mouse location & append
      const currentCoord = { x: event.clientX, y: event.clientY };
      const newCoordinates = new Array<Coordinate>(coordinates as any);
      newCoordinates.push(currentCoord);

      (setCoordinates as React.Dispatch<Array<Coordinate>>) (newCoordinates);
   };

   return (<canvas
      className="App-canvas"
      ref={canvasRef as any}
      width={canvasWidth as any}
      height={canvasHeight as any}
      onClick = { handleCanvasClick }
   />);
}
