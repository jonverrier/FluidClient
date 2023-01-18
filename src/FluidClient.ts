// Copyright (c) 2023 TXPCo Ltd

// FluidClient
import { MSerialisable } from './SerialisationFramework';
import { Persona } from './Persona';

export interface IClientProps {

}


export class FluidClient extends MSerialisable {

   private _remoteUsers: Array<Persona>;
   private _localUser: Persona;

   // constructor(props: IClientProps) {

   constructor() {

      super();

      // Initial status is the user not logged in, no others are known either

      this._remoteUsers = new Array<Persona>();
      this._localUser = Persona.notLoggedIn();
   }

   equals(rhs: FluidClient): boolean {

      if (this === rhs)
         return true;

      // Different if local users are different
      if (!(this._localUser.equals(rhs._localUser)))
         return false;

      // final case - same of remoteUsers are the same, else different
      return (this._remoteUsers.length === rhs._remoteUsers.length &&
         this._remoteUsers.every((val, index) => val.equals (rhs._remoteUsers[index])));
   } 

   streamToJSON(): string {

      return JSON.stringify({ localUser: this._localUser, remoteUsers: this._remoteUsers});
   }

   streamFromJSON(stream: string): void {

      const obj = JSON.parse(stream);

      this._localUser = new Persona (obj.localUser);

      this._remoteUsers = new Array<Persona>();

      for (var i in obj.remoteUsers) {
         this._remoteUsers.push(new Persona(obj.remoteUsers[i]));         
      }
   }

   /**
    * set of 'getters' for private variables
    */

   get localUser(): Persona {
      return this._localUser;
   }

   get remoteUsers(): Array<Persona> {
      return this._remoteUsers;
   }

   set localUser(localUser_: Persona) {
      this._localUser = localUser_;
   }

   // Used for debug purpises only - normally must pick this up from Fluid relay
   addRemoteUser(remoteUser_: Persona): void {
      this._remoteUsers.push(remoteUser_);
   }

   // Update timestamp on local user. Pass it in to provide better testability (can read back what you passed in)
   refreshLocalUser(date_: Date): void {

      this._localUser.lastSeenAt = date_;
   }
}