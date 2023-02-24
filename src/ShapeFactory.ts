// Copyright (c) 2023 TXPCo Ltd

import { Shape } from "./Shape"; 

// Signature for the factory function 
type FactoryFunctionFor<Shape> = () => Shape;

var firstFactory: ShapeFactory = null;

export class ShapeFactory {

   _className: string;
   _factoryMethod: FactoryFunctionFor<Shape>;
   _nextFactory: ShapeFactory;

   constructor(className_: string, factoryMethod_: FactoryFunctionFor<Shape>) {
      this._className = className_;
      this._factoryMethod = factoryMethod_;
      this._nextFactory = null;

      if (firstFactory === null) {
         firstFactory = this;
      } else {
         var nextFactory: ShapeFactory = firstFactory;

         while (nextFactory._nextFactory) {
            nextFactory = nextFactory._nextFactory;
         }
         nextFactory._nextFactory = this;
      }
   }

   static create(className: string): Shape {
      var nextFactory: ShapeFactory = firstFactory;

      while (nextFactory) {
         if (nextFactory._className === className) {
            return nextFactory._factoryMethod();
         }
         nextFactory = nextFactory._nextFactory;
      }
      return null;
   }
}


