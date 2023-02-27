/////////////////////////////////////////
// StreamingFramework
// Copyright (c) 2023 TXPCo Ltd
/////////////////////////////////////////


/// <summary>
/// MStreamable - root class for all derived types that can stream to and from JSON 
/// </summary>
export abstract class MStreamable {

   constructor() {
   }

   abstract streamOut(): string;
   abstract streamIn(stream: string): void;
}

/// <summary>
/// MDynamicStreamable - root class for all derived types that can stream to and from JSON with dynamic creation based on className stored in the stream
/// </summary>
export abstract class MDynamicStreamable extends MStreamable {

   constructor() {
      super();
   }

   abstract className(): string;

   flatten (): string {

      return JSON.stringify({ className: this.className(), data: this.streamOut() });
   }

   static resurrect(stream: string): MDynamicStreamable {

      const parsed = JSON.parse(stream);

      let obj = DynamicStreamableFactory.create(parsed.className);

      obj.streamIn(parsed.data);

      return obj;
   }
}

// Signature for the factory function 
type FactoryFunctionFor<MDynamicStreamable> = () => MDynamicStreamable;

var firstFactory: DynamicStreamableFactory = null;

export class DynamicStreamableFactory {

   _className: string;
   _factoryMethod: FactoryFunctionFor<MDynamicStreamable>;
   _nextFactory: DynamicStreamableFactory;

   constructor(className_: string, factoryMethod_: FactoryFunctionFor<MDynamicStreamable>) {
      this._className = className_;
      this._factoryMethod = factoryMethod_;
      this._nextFactory = null;

      if (firstFactory === null) {
         firstFactory = this;
      } else {
         var nextFactory: DynamicStreamableFactory = firstFactory;

         while (nextFactory._nextFactory) {
            nextFactory = nextFactory._nextFactory;
         }
         nextFactory._nextFactory = this;
      }
   }

   static create(className: string): MDynamicStreamable {
      var nextFactory: DynamicStreamableFactory = firstFactory;

      while (nextFactory) {
         if (nextFactory._className === className) {
            return nextFactory._factoryMethod();
         }
         nextFactory = nextFactory._nextFactory;
      }
      return null;
   }
}
