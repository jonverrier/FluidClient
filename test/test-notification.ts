'use strict';
// Copyright TXPCo ltd, 2021
import { expect } from 'chai';
import { describe, it } from 'mocha';

import {
   Interest,
   Notification,
   NotificationFor,
   ObserverInterest,
   Notifier,
   Observer
} from '../src/NotificationFramework';


describe("NotificationFramework", function () {

   it("Needs to create, test & assign Interest", function () {

      var notifier = new Notifier();
      var notificationId1 : string = "Playing";
      var notificationId2: string = "Paused";

      var interest1: Interest = new Interest(notifier, notificationId1);
      var interest2: Interest = new Interest(notifier, notificationId2);
      var interest3: Interest = new Interest (interest1);
      var interest4: Interest = new Interest();

      expect(interest1.equals(interest1)).to.equal(true);
      expect(interest1.equals(interest2)).to.equal(false);
      expect(interest1.equals(interest3)).to.equal(true);
      expect(interest1.equals(interest4)).to.equal(false);
      expect(interest1.notificationId === notificationId1).to.equal(true);
      expect(interest1.notifier === notifier).to.equal(true);

      interest2.assign(interest1);
      expect(interest1.equals(interest2)).to.equal(true);
   });

   it("Needs to create, test & assign Notification", function () {

      var notificationId1: string = "Playing";
      var notificationId2: string = "Paused";

      var notification1: Notification = new Notification(notificationId1);
      var notification2: Notification = new Notification(notificationId2);
      var notification3: Notification = new Notification(notification1);
      var notification4: Notification = new Notification();

      expect(notification1.equals(notification1)).to.equal(true);
      expect(notification1.equals(notification2)).to.equal(false);
      expect(notification1.equals(notification3)).to.equal(true);
      expect(notification1.equals(notification4)).to.equal(false);
      expect(notification1.notificationId === notificationId1).to.equal(true);

      notification2.assign(notification1);
      expect(notification1.equals(notification2)).to.equal(true);
   });

   it("Need to create, test & assign NotificationFor<EventData>", function () {

      var notificationId1: string = "Playing";
      var notificationId2: string = "Paused";

      var notification1: NotificationFor<number> = new NotificationFor<number>(notificationId1, 1);
      var notification2: NotificationFor<number> = new NotificationFor<number>(notificationId2, 2);
      var notification3: NotificationFor<number> = new NotificationFor<number>(notification1);
      var notification4: NotificationFor<number> = new NotificationFor<number>();

      expect(notification1.equals(notification1)).to.equal(true);
      expect(notification1.equals(notification2)).to.equal(false);
      expect(notification1.equals(notification3)).to.equal(true);
      expect(notification1.equals(notification4)).to.equal(false);
      expect(notification1.notificationId === notificationId1).to.equal(true);
      expect(notification1.eventData === 1).to.equal(true);

      notification2.assign(notification1);
      expect(notification1.equals(notification2)).to.equal(true);
   });

   it("Need to create, test & assign ObserverInterest", function () {

      var notifier = new Notifier();
      var observer = new Observer();
      var notificationId1: string = "Playing";
      var notificationId2: string = "Paused";

      var interest1: Interest = new Interest(notifier, notificationId1);
      var interest2: Interest = new Interest(notifier, notificationId2);

      var observerInterest1: ObserverInterest = new ObserverInterest (observer, interest1);
      var observerInterest2: ObserverInterest = new ObserverInterest (observer, interest2);
      var observerInterest3: ObserverInterest = new ObserverInterest (observerInterest1);

      expect(observerInterest1.equals(observerInterest1)).to.equal(true);
      expect(observerInterest1.equals(observerInterest2)).to.equal(false);
      expect(observerInterest1.equals(observerInterest3)).to.equal(true);
      expect(observerInterest1.interest.equals(interest1)).to.equal(true);
      expect(observerInterest1.observer === observer).to.equal(true);
   
   });

});

/*

TEST(MediaNotificationFramework, ObserverInterest) {

   std:: shared_ptr < Media:: Notifier > pNotifier(new Media:: Notifier());

   const wchar_t* notificationId1 = L"Playing";
   const wchar_t* notificationId2 = L"Paused";

   Media::Interest interest1(pNotifier, notificationId1);
   Media::Interest interest2(pNotifier, notificationId2);

   std:: shared_ptr < Media:: Observer > pObserver(new Media:: Observer());

   Media::ObserverInterest observerInterest1(interest1, pObserver);
   Media::ObserverInterest observerInterest2(interest2, pObserver);
   Media::ObserverInterest observerInterest3(observerInterest1);

   EXPECT_EQ(observerInterest1, observerInterest1);
   EXPECT_NE(observerInterest1, observerInterest2);
   EXPECT_EQ(observerInterest1, observerInterest3);
}

class TestObserver : public Media::Observer {

   public:
   const wchar_t* lastCallN = L"notify";
   const wchar_t* lastCallNInt = L"notifyInt";
   const wchar_t* lastCall = NULL;

   // Constructors
   TestObserver() {
   }

   virtual
   ~TestObserver() { }

   virtual void notify(const Media:: Interest& interest, const Media:: Notification& notification) {
      lastCall = lastCallN;
   }

   virtual void notifyInt(const Media:: Interest& interest, const Media:: NotificationFor<int>& notification) {
      lastCall = lastCallNInt;
   }


};

TEST(MediaNotificationFramework, FullFlow) {

   std:: shared_ptr < Media:: Notifier > pNotifier(new Media:: Notifier());

   const wchar_t* notificationId1 = L"Playing";
   const wchar_t* notificationId2 = L"Paused";

   Media::Interest interest1(pNotifier, notificationId1);
   Media::Interest interest2(pNotifier, notificationId2);

   std:: shared_ptr < TestObserver > pTestObserver(new TestObserver());
   std:: shared_ptr < Media:: Observer > pObserver(pTestObserver);

   Media::ObserverInterest observerInterest1(interest1, pObserver);
   Media::ObserverInterest observerInterest2(interest2, pObserver);
   Media::ObserverInterest observerInterest3(observerInterest1);

   pNotifier -> addObserver(observerInterest1);
   pNotifier -> addObserver(observerInterest2);

   Media::Notification notification(notificationId1);

   // Call sequence 2 - direct 
   pNotifier -> notifyObservers(interest1.notificationId(), notification);
   EXPECT_EQ(pTestObserver.get() -> lastCall, pTestObserver.get() -> lastCallN);


   // Call sequence 2 - routed & with a payload
   pNotifier -> removeAllObservers();

   std:: shared_ptr < Media:: Observer > pObserverRouter(new Media:: ObserverRouterFor<TestObserver, int>(pTestObserver, & TestObserver:: notifyInt));
   Media::ObserverInterest observerInterest4(interest1, pObserverRouter);
   pNotifier -> addObserver(observerInterest4);

   Media:: NotificationFor < int > notificationInt(notificationId1, 2);
   pNotifier -> notifyObservers(interest1.notificationId(), notificationInt);
   EXPECT_EQ(pTestObserver.get() -> lastCall, pTestObserver.get() -> lastCallNInt);
}

*/