// Copyright (c) 2023 TXPCo Ltd

export class KeyValueStoreKeys {

   public static localUserUuid: string = "LocalUserUuid";
   public static localWhiteboardUuid: string = "LocalWhiteboardUuid";

}

export interface IKeyValueStore {

   hasItem(key: string): boolean;

   getItem(key: string) : string;

   setItem(key: string, value: string): void;

   removeItem(key: string);

}

export function localKeyValueStore(): IKeyValueStore {
   return new LocalKeyValueStore;
}

class LocalKeyValueStore implements IKeyValueStore {

   constructor() {

   }

   hasItem(key: string): boolean {

      return window.localStorage.getItem(key) !== null;
   }

   getItem(key: string): string {

      return window.localStorage.getItem(key);
   }

   setItem(key: string, value: string): void {

      return window.localStorage.setItem(key, value);
   }

   removeItem(key: string) {

      return window.localStorage.removeItem(key);
   }

}