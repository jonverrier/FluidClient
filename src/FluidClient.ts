// Copyright (c) 2023 TXPCo Ltd

// FluidClient
import { MSerialisable } from './SerialisationFramework';

export interface IClientProps {

}


export class FluidClient extends MSerialisable {

   private _registeredUsers: Array<String>;

   // constructor(props: IClientProps) {

   constructor() {

      super();

      // Initial status is the user not logged in, no others are known either

      this._registeredUsers = new Array<String>();
   }

   equals(rhs: FluidClient): boolean {

      if (this === rhs)
         return true;

      return (this._registeredUsers.length === rhs._registeredUsers.length &&
         this._registeredUsers.every((val, index) => val === rhs._registeredUsers[index]));
   } 

   streamToJSON(): string {

      return JSON.stringify (this._registeredUsers);
   }

   streamFromJSON(stream: string): void {

      var _this: FluidClient = this;

      _this._registeredUsers = new Array<string>();

      JSON.parse(stream, function (key, value) {
         if (key)
            _this._registeredUsers[key] = value
      });
   }

   registerUser(user: string): void {

      this._registeredUsers.push(user);
   }

   registeredUsers(): Array<String> {
      return this._registeredUsers;
   }
}