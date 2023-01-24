// Copyright (c) 2023 TXPCo Ltd

// Participants
import { MSerialisable } from './SerialisationFramework';
import { Persona } from './Persona';

export interface IClientProps {

}

export class Participants extends MSerialisable {

   private _localUser: Persona;
   private _remoteUsers: Array<Persona>;

   /**
    * Create an empty Participants object - required for particiation in serialisation framework
    */
   public constructor();

   /**
    * Create a Participants object
    * @param localUser_ - local User Persona 
    * @param remoteUsers_ - array of personas for remote users 
    */
   public constructor(localUser_: Persona, remoteUsers_: Array<Persona>);

   public constructor(...arr: any[])
   {

      super();

      if (arr.length === 0) {
         // Empty object - initial status is the user unknow, no others are known either
         this._localUser = Persona.unknown();
         this._remoteUsers = new Array<Persona>();
      }
      else {
         this._localUser = arr[0];
         this._remoteUsers = arr[1];
      }
   }

   equals(rhs: Participants): boolean {

      if (this === rhs)
         return true;

      // Different if local users are different
      if (!(this._localUser.equals(rhs._localUser)))
         return false;

      // final case - same of _remoteUsers are the same, else different
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

   set remoteUsers(remoteUsers_: Persona[]) {
      this._remoteUsers = remoteUsers_;
   }

   // Update timestamp on local user. Pass it in to provide better testability (can read back what you passed in)
   refreshLocalUser(date_: Date): void {

      this._localUser.lastSeenAt = date_;
   }
}