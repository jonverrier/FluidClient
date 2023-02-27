// Copyright (c) 2023 TXPCo Ltd
// Copyright (c) 2023 TXPCo Ltd
import { SharedMap, IValueChanged } from "fluid-framework";

import { MDynamicStreamable } from './StreamingFramework';
import { Interest, NotificationFor, Notifier } from './NotificationFramework';

export class CaucusOf<AType extends MDynamicStreamable> extends Notifier {

   public static caucusMemberAddedNotificationId = "caucusMemberAdded";
   public static caucusMemberAddedInterest = new Interest(CaucusOf.caucusMemberAddedNotificationId);

   public static caucusMemberChangedNotificationId = "caucusMemberChanged";
   public static caucusMemberChangedInterest = new Interest(CaucusOf.caucusMemberChangedNotificationId);

   public static caucusMemberRemovedNotificationId = "caucusMemberRemoved";
   public static caucusMemberRemovedInterest = new Interest(CaucusOf.caucusMemberRemovedNotificationId);

   private _localCopy: Map<string, AType>;
   private _shared: SharedMap;

   constructor(shared_: SharedMap) {
      super();

      this._shared = shared_;
      this._localCopy = new Map<string, AType>();

      (this._shared as any).on("valueChanged", (changed: IValueChanged, local: boolean, target: SharedMap) => {

         if (local)
            return;

         if (changed.previousValue) {

            if (target.has(changed.key)) {
 
               this.notifyObservers(CaucusOf.caucusMemberChangedInterest, new NotificationFor<string>(CaucusOf.caucusMemberChangedInterest, changed.key));
            }
            else {

               this.notifyObservers(CaucusOf.caucusMemberRemovedInterest, new NotificationFor<string>(CaucusOf.caucusMemberRemovedInterest, changed.key));
            }
         } else {

            this.notifyObservers(CaucusOf.caucusMemberAddedInterest, new NotificationFor<string>(CaucusOf.caucusMemberAddedInterest, changed.key));
         }
      });
   }

   has(key: string): boolean {

      return this._shared.has(key);
   }

   add(key: string, element: AType): void {

      let stream = element.flatten ();

      this._shared.set(key, stream);
   }

   remove (key: string): boolean {

      return this._shared.delete(key);
   }

   amend(key: string, element: AType) {

      let stream = element.flatten();

      this._shared.set(key, stream);
   }

   get (key: string) : AType {

      let element = this._shared.get(key);
      if (element) {

         let object = MDynamicStreamable.resurrect(element) as AType;

         return object;
      }

      return null;
   }

   current(): Map<string, AType> {

      this._localCopy.clear();

      this._shared.forEach((value: any, key: string, map: Map<string, any>) => {

         let object = MDynamicStreamable.resurrect(value) as AType;

         this._localCopy.set(key, object);
      }); 

      return this._localCopy;
   }
}