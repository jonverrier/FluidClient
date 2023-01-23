// Copyright (c) 2023 TXPCo Ltd

export function uuid(): string {
   let url = URL.createObjectURL(new Blob());
   URL.revokeObjectURL(url);
   var newUuid: string;

   if (typeof window === 'undefined') {
      newUuid = url.split(":")[2];
   }
   else {
      newUuid = url.split("/")[1];
   }

   return newUuid;
}

