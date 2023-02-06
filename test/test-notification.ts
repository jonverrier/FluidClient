'use strict';
// Copyright TXPCo ltd, 2023
import { expect } from 'chai';
import { describe, it } from 'mocha';

import { log, LogLevel } from 'missionlog';

import {
   Interest,
   Notification,
   NotificationFor,
   ObserverInterest,
   Notifier,
   IObserver,
   NotificationRouterFor
} from '../src/NotificationFramework';

class MockObserver implements IObserver {

   _lastNotification: Notification;

   constructor() {
      this._lastNotification = null;
   }

   notify(interest_: Interest, notification_: Notification): void {

      this._lastNotification = notification_;
   };

   notifyInt (interest_: Interest, notification_: NotificationFor<number>): void {

      this._lastNotification = notification_;
   };
}

// handler which does logging to the console 
const logger = {
   [LogLevel.ERROR]: (tag, msg, params) => console.error(msg, ...params),
   [LogLevel.WARN]: (tag, msg, params) => console.warn(msg, ...params),
   [LogLevel.INFO]: (tag, msg, params) => console.log(msg, ...params),
   [LogLevel.TRACE]: (tag, msg, params) => console.log(msg, ...params),
   [LogLevel.DEBUG]: (tag, msg, params) => console.log(msg, ...params),
} as Record<LogLevel, (tag: string, msg: unknown, params: unknown[]) => void>;

describe("NotificationFramework", function () {

   log.init({ notification: 'DEBUG' }, (level, tag, msg, params) => {
      logger[level as keyof typeof logger](tag, msg, params);
   });
   
   it("Needs to create, test & assign Interest", function () {

      var notificationId1 : string = "Playing";
      var notificationId2: string = "Paused";

      var interest1: Interest = new Interest(notificationId1);
      var interest2: Interest = new Interest(notificationId2);
      var interest3: Interest = new Interest (interest1);
      var interest4: Interest = new Interest();

      expect(interest1.equals(interest1)).to.equal(true);
      expect(interest1.equals(interest2)).to.equal(false);
      expect(interest1.equals(interest3)).to.equal(true);
      expect(interest1.equals(interest4)).to.equal(false);
      expect(interest1.notificationId === notificationId1).to.equal(true);

      interest2.assign(interest1);
      expect(interest1.equals(interest2)).to.equal(true);
   });

   it("Needs to create, test & assign Notification", function () {

      var notificationId1: string = "Playing";
      var notificationId2: string = "Paused";

      var interest1: Interest = new Interest(notificationId1);
      var interest2: Interest = new Interest(notificationId2);

      var notification1: Notification = new Notification(interest1);
      var notification2: Notification = new Notification(interest2);
      var notification3: Notification = new Notification(notification1);
      var notification4: Notification = new Notification();

      expect(notification1.equals(notification1)).to.equal(true);
      expect(notification1.equals(notification2)).to.equal(false);
      expect(notification1.equals(notification3)).to.equal(true);
      expect(notification1.equals(notification4)).to.equal(false);
      expect(notification1.interest.equals(interest1)).to.equal(true);

      notification2.assign(notification1);
      expect(notification1.equals(notification2)).to.equal(true);
   });

   it("Need to create, test & assign NotificationFor<EventData>", function () {

      var notificationId1: string = "Playing";
      var notificationId2: string = "Paused";

      var interest1: Interest = new Interest(notificationId1);
      var interest2: Interest = new Interest(notificationId2);

      var notification1: NotificationFor<number> = new NotificationFor<number>(interest1, 1);
      var notification2: NotificationFor<number> = new NotificationFor<number>(interest2, 2);
      var notification3: NotificationFor<number> = new NotificationFor<number>(notification1);
      var notification4: NotificationFor<number> = new NotificationFor<number>();

      expect(notification1.equals(notification1)).to.equal(true);
      expect(notification1.equals(notification2)).to.equal(false);
      expect(notification1.equals(notification3)).to.equal(true);
      expect(notification1.equals(notification4)).to.equal(false);
      expect(notification1.interest.equals(interest1)).to.equal(true);
      expect(notification1.eventData === 1).to.equal(true);

      notification2.assign(notification1);
      expect(notification1.equals(notification2)).to.equal(true);
   });

   it("Need to create, test & assign ObserverInterest", function () {

      var observer = new MockObserver();
      var notificationId1: string = "Playing";
      var notificationId2: string = "Paused";

      var interest1: Interest = new Interest(notificationId1);
      var interest2: Interest = new Interest(notificationId2);

      var observerInterest1: ObserverInterest = new ObserverInterest (observer, interest1);
      var observerInterest2: ObserverInterest = new ObserverInterest (observer, interest2);
      var observerInterest3: ObserverInterest = new ObserverInterest (observerInterest1);
      var observerInterest4: ObserverInterest = new ObserverInterest();

      expect(observerInterest1.equals(observerInterest1)).to.equal(true);
      expect(observerInterest1.equals(observerInterest2)).to.equal(false);
      expect(observerInterest1.equals(observerInterest3)).to.equal(true);
      expect(observerInterest1.equals(observerInterest4)).to.equal(false);
      expect(observerInterest1.interest.equals(interest1)).to.equal(true);
      expect(observerInterest1.observer === observer).to.equal(true);

      observerInterest4.assign(observerInterest1);
      expect(observerInterest1.equals(observerInterest4)).to.equal(true);
   });

   it("Need to create, test & assign ObservationRouterFor", function () {

      var observer = new MockObserver();
      var observer2 = new MockObserver();

      var observationRouter1: NotificationRouterFor<number> = new NotificationRouterFor<number>(observer.notifyInt.bind(observer));
      var observationRouter2: NotificationRouterFor<number> = new NotificationRouterFor<number>(observer.notifyInt.bind(observer2));
      var observationRouter3: NotificationRouterFor<number> = new NotificationRouterFor<number>(observationRouter1);
      var observationRouter4: NotificationRouterFor<number> = new NotificationRouterFor<number>();

      expect(observationRouter1.equals(observationRouter1)).to.equal(true);
      expect(observationRouter1.equals(observationRouter2)).to.equal(false);
      expect(observationRouter1.equals(observationRouter3)).to.equal(true);
      expect(observationRouter1.function !== null).to.equal(true);
      expect(observationRouter4.function === null).to.equal(true);

      observationRouter2.assign(observationRouter1);
      expect(observationRouter1.equals(observationRouter2)).to.equal(true);
   });

   it("Needs to flow notifications from Notifier to Observer", function () {

      var notifier = new Notifier();
      var observerYes = new MockObserver();
      var observerNo = new MockObserver();

      var notificationId1: string = "Playing";
      var notificationId2: string = "Paused";

      var interest1: Interest = new Interest(notificationId1);
      var interest2: Interest = new Interest(notificationId2);

      var observerInterest1: ObserverInterest = new ObserverInterest(observerYes, interest1);
      var observerInterest2: ObserverInterest = new ObserverInterest(observerNo, interest2);

      notifier.addObserver(observerInterest1);
      notifier.addObserver(observerInterest2);

      // Call sequence 1 - simple notification
      var notification: Notification = new Notification(interest1);

      notifier.notifyObservers(interest1, notification);
      expect(observerYes._lastNotification.equals(notification) === true).to.equal(true);
      expect((observerNo._lastNotification === null) === true).to.equal(true);

      // Call sequence 2 - notification with Notification payload
      var notificationForInt: NotificationFor<number> = new NotificationFor<number>(interest1, 1);

      notifier.notifyObservers(interest1, notificationForInt);
      expect(observerYes._lastNotification.equals(notificationForInt) === true).to.equal(true);
      expect((observerNo._lastNotification === null) === true).to.equal(true);

      // Tidy
      expect(notifier.removeObserver(observerInterest2) === true).to.equal(true);
      expect(notifier.removeObserver(observerInterest2) === false).to.equal(true);
      notifier.removeAllObservers();

      // Call sequence 3 - routed & with a payload
      var observationRouter: NotificationRouterFor<number> = new NotificationRouterFor<number>(observerYes.notifyInt.bind(observerYes));

      var observerInterest3: ObserverInterest = new ObserverInterest(observationRouter, interest1);
      notifier.addObserver(observerInterest3);

      var notificationForInt2: NotificationFor<number> = new NotificationFor<number>(interest1, 2);
      notifier.notifyObservers(interest1, notificationForInt2);
      expect(observerYes._lastNotification.equals(notificationForInt2) === true).to.equal(true);
      expect((observerNo._lastNotification === null) === true).to.equal(true);
   });
});


