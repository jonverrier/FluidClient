// Copyright (c) 2023 TXPCo Ltd

export interface IKeyValueStore {

   getItem(key: string) : string;

   setItem(key: string, value: string): void;

   removeItem(key: string);

}

export function sessionkeyValueStore(): IKeyValueStore {
   return new SessionKeyValueStore;
}

class SessionKeyValueStore implements IKeyValueStore {

   constructor() {

   }

   getItem(key: string): string {

      return window.sessionStorage.getItem(key);
   }

   setItem(key: string, value: string): void {

      return window.sessionStorage.setItem(key, value);
   }

   removeItem(key: string) {

      return window.sessionStorage.removeItem(key);
   }

}