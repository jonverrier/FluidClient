// Copyright (c) 2023 TXPCo Ltd

export class KeyValueStoreKeys {

   public static localUserUuid: string = "LocalUserUuuid";

}

export interface IKeyValueStore {

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