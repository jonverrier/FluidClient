'use strict';
// Copyright TXPCo ltd, 2021
import { expect } from 'chai';
import { describe, it } from 'mocha';

import { IKeyValueStore, localKeyValueStore } from '../src/KeyValueStore';


const key = "key";
const item = "item";

const localStorageMock = (() => {
   let store = {};

   return {
      key(index: number): string | null {
         return null;
      },
      length: 0, 
      getItem(key) {
         return store[key] || null;
      },
      setItem(key, value) {
         store[key] = value.toString();
      },
      removeItem(key) {
         delete store[key];
      },
      clear() {
         store = {};
      }
   };
})();


describe("KeyValueStore", function () {

   var oldWindow: any = global.window;

   beforeEach(() => {
      (global.window as any) = { localStorage: localStorageMock };
   });

   afterEach(() => {
      (global.window as any) = oldWindow;
   });

   it("Needs to create an item and retrieve it", function () {

      var store: IKeyValueStore = localKeyValueStore();

      store.setItem(key, item);

      expect(store.getItem(key)).to.equal(item);
   });

   it("Needs to create an item and remove it", function () {

      var store: IKeyValueStore = localKeyValueStore();

      store.setItem(key, item);
      store.removeItem(key);

      expect(store.getItem(key)).to.equal(null);
   });
});

