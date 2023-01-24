// NotificationFramework
// Copyright (c) 2023 TXPCo Ltd
/////////////////////////////////////////

/// <summary>
/// Interest -  encapsulates what is being observed - a specific notification Id from a specific Notifier
/// </summary>
export class Interest { 

   private _notificationId: string;
   private _notifier: Notifier;

   /**
    * Create a Interest object
    * @param notifier_ - local User Persona 
    * @param remoteUsers_ - array of personas for remote users 
    */
   constructor(notifier_: Notifier, notificationId_: string);

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
      if (arr.length === 0) {
         this._notifier = null;
         this._notificationId = null;
         return;
      }
      if (arr.length === 1) {
         this._notifier = arr[0]._notifier;
         this._notificationId = arr[0]._notificationId;
      }
      else {
         this._notifier = arr[0];
         this._notificationId = arr[1];
      }
   }

   /**
   * set of 'getters' for private variables
   */
   get notifier(): Notifier {
      return this._notifier;
   }
   get notificationId(): string {
      return this._notificationId;
   }

   /**
    * test for equality - checks all fields are the same. 
    * NB must use field values, not identity bcs if objects are streamed to/from JSON, identities will be different. 
    * @param rhs - the object to compare this one to.  
    */
   equals(rhs: Interest): boolean {
      
      return ((this._notifier === rhs._notifier) && // TODO - use Notfier.equals()
         (this._notificationId === rhs._notificationId));
   }

   /**
    * assignment operator 
    * @param rhs - the object to assign this one from.  
    */
   assign(rhs: Interest): Interest {
      this._notifier = rhs._notifier;
      this._notificationId = rhs._notificationId;

      return this;
   }

}

export class Notifier {

}

/*

#ifndef MEDIANOTIFICATIONFRAMSEWORK_INCLUDED
#define MEDIANOTIFICATIONFRAMSEWORK_INCLUDED

#include <string>
#include <list>

#include "Host.h"
#include "Media.h"

namespace Media {

   // Utility function for comparing weak pointers
   template <class T> T* weakAddress(const std::weak_ptr<T>& p) {
      if (p.use_count() > 0) {
         auto pShared = p.lock();
         return pShared.get();
      }
      return nullptr;
   }

   typedef const wchar_t* NotificationId; // Notification events are string for ease of debugging

   class Interest;
   class Notification;
   class ObserverInterest;
   class Notifier;
   class Observer;

/// <summary>
/// Notification -  base class for all events. Base carries references to the notifcationId. derived classes add a data package via template class below.
/// Value class - just holds reference to the data, is expected to exist only for the synchronous life of the notification.
/// </summary>
   class MEDIA_API Notification  {

   public:

      // Constructors
      Notification(const NotificationId& notificationIdIn);
      Notification(const Notification& notification);
      virtual ~Notification();

      // Attributes
      NotificationId	notificationId() const;

      // Operations
      Notification& operator= (const Notification& event);
      bool	operator==(const Notification& rhs) const;
      bool  operator!=(const Notification& rhs) const;

   protected:

   private:
#pragma warning (push)
#pragma warning (disable: 4251) // Member is private anyway
      const NotificationId& m_notificationId;
#pragma warning (pop)
   }; // Notification

   /// <summary>
   /// NotificationFor -  template to specialse Notification by adding an EventData class. 
   /// Value class - just holds reference to the data, is expected to exist only for the synchronous life of the notification. 
   /// If you want data to last longer, add a pointer type and the observer will have to save it. 
   /// </summary>
   template <class EventData>
   class NotificationFor : public Notification
   {
   public:

      // Constructors
      NotificationFor(NotificationId& notificationIdIn, const EventData& eventData)
         : Notification(notificationIdIn), m_eventData(eventData) {
      }

      NotificationFor(const NotificationFor<EventData>& rhs)
         : Notification(rhs), m_eventData(rhs.m_eventData) {
      }

      // Attributes
      const EventData& eventData() const { 
         return m_eventData; 
      }

      // Operations
      NotificationFor<EventData>& operator=(const NotificationFor<EventData>& rhs) {
         Notification::operator= (rhs);
         m_eventData = rhs.m_eventData;
      }
      bool	operator==(const NotificationFor<EventData>& rhs) const {
         return Notification::operator==(rhs) && m_eventData == rhs.m_eventData;
      }

      bool  operator!=(const NotificationFor<EventData>& rhs) const {
         return Notification::operator!=(rhs) || m_eventData != rhs.m_eventData;
      }

   private:

      const EventData& m_eventData;
   };

/// <summary>
/// ObserverInterest -  an Observer plus an Interest 
/// </summary>
   class MEDIA_API ObserverInterest
   {
   public:

      // Constructors
      ObserverInterest(Interest& interest,
                       std::weak_ptr<Observer> pObserver);
      ObserverInterest(const ObserverInterest& rhs);
      virtual ~ObserverInterest();

      // Attributes
      const Interest& interest() const;
      std::weak_ptr<Observer>	observer() const;

      // Operations
      ObserverInterest& operator=(const ObserverInterest& rhs);
      bool	operator==(const ObserverInterest& rhs) const;
      bool  operator!=(const ObserverInterest& rhs) const;

   protected:

   private:
#pragma warning (push)
#pragma warning (disable: 4251) // Member is private anyway
      Interest& m_interest;
      std::weak_ptr<Observer> m_pObserver;
#pragma warning (pop)
   };

   

   /// <summary>
   /// Notifier -  class that sends notifications when things change
   /// </summary>
   class MEDIA_API Notifier {

   public:
      // Constructors
      Notifier();
      virtual ~Notifier();

      // Operations
      void enableNotification(bool enable = true);
      void disableNotification();
      bool isEnabledForNotification() const;

      void notifyObservers(const NotificationId& id, const Notification& event);

      // Add the supplied observer to the list of observers associated with
      // the supplied interest.
      void addObserver(const ObserverInterest& observerFInterest);

      // Remove the supplied observer from the list of observers associated
      // with the supplied interest.
      void removeObserver(const ObserverInterest& observerInterest);

      void removeAllObservers();

   protected:

   private:
#pragma warning (push)
#pragma warning (disable: 4251) // Member is private anyway
      bool m_isEnabled;
      std::list< ObserverInterest > m_observers;
#pragma warning (pop)

   };  //Notifier

   class MEDIA_API Observer {

   public:
      // Constructors
      Observer();
      virtual
      ~Observer(); 

      virtual void notify (const Interest& interest, const Notification& notification);

   protected:



   private:

   }; // Observer

   /// <summary>
   /// ObserverRouterFor -  template to connect a specific function signature for the method that is called in a notification 
   /// </summary>
   /// 
   template <class AnObserver, class EventData>
   class ObserverRouterFor : public Observer
   {
      typedef void (AnObserver::* PFunctionFor)(const Interest& interest, const NotificationFor<EventData>&);

   public:
      // Constructors
      ObserverRouterFor(std::weak_ptr<AnObserver> pObserver,
                        PFunctionFor pFunction)
         : Observer(), m_pObserver(pObserver), m_pFunction(pFunction) {
      }

      ObserverRouterFor(const ObserverRouterFor& rhs)
         : m_pObserver(rhs.m_pObserver), m_pFunction(rhs.m_pFunction) {
      }

      ~ObserverRouterFor() {
      }

      // Attributes
      PFunctionFor function() const {
         return m_pFunction;
      }
      std::weak_ptr<AnObserver> observer() const {
         return m_pObserver;
      }

      // Operations
      ObserverRouterFor<AnObserver, EventData>& operator=(const ObserverRouterFor<AnObserver, EventData>& rhs) {
         m_pObserver = rhs.m_pObserver;
         m_pFunction = rhs.m_pFunction;

         return *this;
      }

      bool	operator==(const ObserverRouterFor<AnObserver, EventData>& rhs) const {
         return m_pObserver == rhs.m_pObserver &&
            m_pFunction == rhs.m_pFunction;
      }

      bool  operator!=(const ObserverRouterFor<AnObserver, EventData>& rhs) const {
         return m_pObserver != rhs.m_pObserver &&
            m_pFunction != rhs.m_pFunction;
      }

      virtual void notify(const Interest& interest, const Notification& notification) {

         // Force downcast to the rquired EventData
         notify(interest, * static_cast<const NotificationFor<EventData> *> ( & notification));
      }

      virtual void notify(const Interest& interest, const NotificationFor<EventData> & notification) {

         std::shared_ptr<AnObserver> pObs = m_pObserver.lock();
         if (pObs.use_count() > 0) {
            (*pObs.get().*m_pFunction) (interest, notification);
         }

      }

   protected:

   private:
#pragma warning (push)
#pragma warning (disable: 4251) // Member is private anyway
      std::weak_ptr<AnObserver> m_pObserver;
      PFunctionFor              m_pFunction;
#pragma warning (pop)
   };

}

#endif // MEDIANOTIFICATIONFRAMSEWORK_INCLUDED
*/