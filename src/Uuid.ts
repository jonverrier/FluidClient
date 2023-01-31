// Copyright (c) 2023 TXPCo Ltd
import { EnvironmentError } from './Errors';

export function uuid(): string {
   let url = URL.createObjectURL(new Blob());
   URL.revokeObjectURL(url);
   var newUuid: string = null;

   if (typeof window === 'undefined') {
      newUuid = url.split(":")[2];
   }
   else {
      switch (window.location.protocol) {
         case 'file:':
            newUuid = url.split("/")[1];
            break;
         case 'http:':
         case 'https:':
         default:
            newUuid = url.split("/")[3];
            break;
      }

   }

   if (!newUuid)
      throw new EnvironmentError("Error creating UUID.");

   return newUuid;
}

