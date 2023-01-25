// NotificationFramework
// Copyright (c) 2023 TXPCo Ltd
/////////////////////////////////////////

/// <summary>
/// Interest -  encapsulates what is being observed - a specific notificationId.
/// </summary>
export class Interest { 

   private _notificationId: string;

   /**
    * Create a Interest object
    * @param notificationId_ - id of the notification 
    */
   constructor(notificationId_: string);

   /**
    * Create a Interest object
    * @param interest_ - object to copy from - should work for JSON format and for real constructed objects
    */
   public constructor(interest_: Interest);

   /**
    * Create an empty Interest object - required for particiation in serialisation framework
    */
   constructor ();

   constructor(...arr: any[]) { 
      if (arr.length === 0) { // Empty Constructor
         this._notificationId = null;
         return;
      }
      else {
         if (this.isMyType(arr[0])) { // Copy Constructor
            this._notificationId = arr[0]._notificationId;
         }
         else { // Individual arguments
            this._notificationId = arr[0];
         }
      }
   }

   private isMyType(rhs: Interest): boolean {
      return rhs.hasOwnProperty('_notificationId');
   }

   /**
   * set of 'getters' for private variables
   */
   get notificationId(): string {
      return this._notificationId;
   }

   /**
    * test for equality - checks all fields are the same. 
    * NB must use field values, not identity bcs if objects are streamed to/from JSON, identities will be different. 
    * @param rhs - the object to compare this one to.  
    */
   equals(rhs: Interest): boolean {
      
      return (this._notificationId === rhs._notificationId);
   }

   /**
    * assignment operator 
    * @param rhs - the object to assign this one from.  
    */
   assign(rhs: Interest): Interest {
      this._notificationId = rhs._notificationId;

      return this;
   }

}

/// <summary>
/// Notification -  base class for all events. Base carries references to the notifcationId. derived classes add a data package via template class below.
/// Value class - just holds reference to the data, is expected to exist only for the synchronous life of the notification.
/// </summary>
export class Notification {

   private _notificationId: string;

   /**
    * Create a Notification object
    * @param notificationId_ - id of the notification 
    */
   constructor(notificationId_: string);

   /**
    * Create a Notification object
    * @param notification_ - object to copy from - should work for JSON format and for real constructed objects
    */
   public constructor(notification_: Notification);

   /**
    * Create an empty Interest object - required for particiation in serialisation framework
    */
   constructor();

   constructor(...arr: any[]) {
      if (arr.length === 0) { // Empty Contrutructor
         this._notificationId = null;
         return;
      }
      else {
         if (this.isMyType(arr[0])) { // Copy Contrutructor
            this._notificationId = arr[0]._notificationId;
         }
         else { // Individual arguments
            this._notificationId = arr[0];
         }
      }
   }

   private isMyType(rhs: Notification): boolean {
      return rhs.hasOwnProperty('_notificationId');
   }

   /**
   * set of 'getters' for private variables
   */
   get notificationId(): string {
      return this._notificationId;
   }

   /**
    * test for equality - checks all fields are the same. 
    * Shallow check.
    * @param rhs - the object to compare this one to.  
    */
   equals(rhs: Notification): boolean {

      return ((this._notificationId === rhs._notificationId));
   }

   /**
    * assignment operator 
    * @param rhs - the object to assign this one from.  
    */
   assign(rhs: Notification): Notification {
      this._notificationId = rhs._notificationId;

      return this;
   }

}

/// <summary>
/// NotificationFor -  template to specialse Notification by adding an EventData class. 
/// Value class - just holds reference to the data, is expected to exist only for the synchronous life of the notification. 
/// If you want data to last longer, add a reference type and the observer will have to save it. 
/// </summary>
export class NotificationFor<EventData> extends Notification
{
   private _eventData: EventData;


   /**
    * Create an empty NotificationFor<EventData>  object - required for particiation in serialisation framework
    */
   constructor();

   /**
    * Create a NotificationFor<EventData> object
    * @param notification_ - object to copy from - should work for JSON format and for real constructed objects
    */
   public constructor(notification_: NotificationFor<EventData>);

   /**
    * Create a Notification object
    * @param notificationId_ - id of the notification 
    * @param eventData_ - the data payload to send with it
    */
   constructor(notificationId_: string, eventData_: EventData) 

   constructor(...arr: any[]) {
      if (arr.length === 0) { // Construct empty
         super();
         this._eventData = null;
         return;
      }
      else 
      if (arr.length === 1) { // Copy constructor
         super (arr[0])
         this._eventData = arr[0]._eventData;
      }
      else { // Individual arguments
         super (arr[0])
         this._eventData = arr[1];
      }
   }

   /**
   * set of 'getters' for private variables
   */
   get eventData(): EventData {
      return this._eventData;
   }

   /**
    * test for equality - checks all fields are the same. 
    * Is a shallow compare if the payload is an object
    * @param rhs - the object to compare this one to.  
    */
   equals(rhs: NotificationFor<EventData>): boolean {

      return (super.equals(rhs) &&
         (this._eventData === rhs._eventData));
   }

   /**
    * assignment operator 
    * @param rhs - the object to assign this one from.  
    */
   assign(rhs: NotificationFor<EventData>): NotificationFor<EventData> {
      super.assign(rhs);
      this._eventData = rhs._eventData;

      return this;
   }
}

/// <summary>
/// ObserverInterest -  an IObserver plus an Interest . Used by Notifieres to hold a list of things that observers are interested in so it can notify them. 
/// </summary>
export class ObserverInterest {

   private _observer: IObserver;
   private _interest: Interest;

   /**
    * Create a Interest object
    * @param observer_ - reference to the observer 
    * @param interest_ - the thing it is interested in 
    */
   constructor(_observer: IObserver, _interest: Interest);

   /**
    * Create a ObserverInterest object
    * @param observerInterest - object to copy from - should work for JSON format and for real constructed objects
    */
   public constructor(observerInterest: ObserverInterest);

   /**
    * Create an empty Interest object - required for particiation in serialisation framework
    */
   constructor();

   constructor(...arr: any[]) {
      if (arr.length === 0) { // Empty constructor
         this._observer = null;
         this._interest = null;
         return;
      }
      if (arr.length === 1) { // Copy constructor
         this._observer = arr[0]._observer;
         this._interest = arr[0]._interest;
      }
      else { // Indivual arguments
         this._observer = arr[0];
         this._interest = arr[1];
      }
   }

   /**
   * set of 'getters' for private variables
   */
   get observer(): IObserver {
      return this._observer;
   }
   get interest(): Interest {
      return this._interest;
   }

   /**
    * test for equality - checks all fields are the same. 
    * Shallow compare
    * @param rhs - the object to compare this one to.  
    */
   equals(rhs: ObserverInterest): boolean {

      return ((this._observer === rhs._observer) && 
         (this._interest === rhs._interest));
   }

   /**
    * assignment operator 
    * @param rhs - the object to assign this one from.  
    */
   assign(rhs: ObserverInterest): ObserverInterest {
      this._observer = rhs._observer;
      this._interest = rhs._interest;

      return this;
   }

}

/// <summary>
/// ObservationRouterFor -  template to act as an intermediary, type-safe router that connects a specific function signature for the method that is called in a notification
/// </summary>
/// 
type FunctionFor<EventData> = (interest: Interest, data: NotificationFor<EventData>) => void;


export class ObservationRouterFor<EventData> implements IObserver
{
   private _function: FunctionFor<EventData>;

   /**
    * Create empty ObservationRouterFor object
    */
   constructor();

   /**
    * Create a ObservationRouterFor object
    * @param interest_ - the thing it is interested in 
    */
   constructor(_function: FunctionFor<EventData>);

   /**
    * Create a ObserverRouterFor<AnObserver, EventData>  object
    * @param observerInterest - object to copy from - should work for JSON format and for real constructed objects
    */
   public constructor(observerRouter: ObservationRouterFor<EventData>);

   constructor(...arr: any[]) {
      if (arr.length === 0) { // Construct empty
         this._function = null;
         return;
      }
      else {
         if (this.isMyType (arr[0])) { // Copy constructor
            this._function = arr[0]._function;
         }
         else { // Individual arguments
            this._function = arr[0];
         }
      }
   }

   private isMyType(rhs: FunctionFor<EventData>): boolean {
      return rhs.hasOwnProperty('_function');
   }

   /**
   * set of 'getters' for private variables
   */
   get function(): FunctionFor<EventData> {
      return this._function;
   }

   /**
    * test for equality - checks all fields are the same. 
    * Shallow compare
    * @param rhs - the object to compare this one to.  
    */
   equals(rhs: ObservationRouterFor<EventData>): boolean {

      return (this._function === rhs._function);
   }

   /**
    * assignment operator 
    * @param rhs - the object to assign this one from.  
    */
   assign(rhs: ObservationRouterFor<EventData>): ObservationRouterFor<EventData> {
      this._function = rhs._function;

      return this;
   }

   notify(interest_: Interest, notification_: NotificationFor<EventData>): void {

      // pass on to the required method
      this._function(interest_, notification_);
   }
}

export interface IObserver {
   notify(interest_: Interest, notification_: Notification): void;
}

/// <summary>
/// Notifier -  class that sends notifications when things change
/// </summary>
export class Notifier {

   private _observerInterests : Array<ObserverInterest>;

   /**
    * Create an empty Notifier object - required for particiation in serialisation framework
    */
   constructor() {
      this._observerInterests = new Array<ObserverInterest>();
   }

   // Operations
   notifyObservers(notificationId_: string, event_: Notification): void {

      this._observerInterests.forEach((observerInterest) => {

         if (observerInterest.interest.notificationId == notificationId_) {

            observerInterest.observer.notify(observerInterest.interest, event_);
         }
       });
    }

   // Add the supplied observer to the list of observers associated with
   // the supplied interest. 
   addObserver(observerInterest_: ObserverInterest): void {

      const index = this._observerInterests.indexOf(observerInterest_);
      if (index === -1) {
         this._observerInterests.push(observerInterest_);
      }
   }

   // Remove the supplied observer from the list of observers associated
   // with the supplied interest.
   // returns TRUE if it was correctly found
   removeObserver(observerInterest_: ObserverInterest): boolean {

      const index = this._observerInterests.indexOf(observerInterest_);
      if (index > -1) {
         this._observerInterests.splice(index, 1);
         return true;
      }
      return false;
   }

   removeAllObservers(): void {
      this._observerInterests.length = 0
   }

};  //Notifier


