// Copyright (c) 2023 TXPCo Ltd

export function uuid(): string {
   let url = URL.createObjectURL(new Blob());
   URL.revokeObjectURL(url);
   return url.split("/")[3];
}

