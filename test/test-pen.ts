'use strict';

// Copyright TXPCo ltd, 2023
import { expect } from 'chai';
import { describe, it } from 'mocha';

import { Pen, PenColour, PenStyle} from '../src/Pen';


describe("Pen", function () {

   it("Needs to create, test & assign Pen", function () {

      var pen1: Pen = new Pen(PenColour.Blue, PenStyle.Solid);
      var pen2: Pen = new Pen(PenColour.Red, PenStyle.Solid);
      var pen3: Pen = new Pen(pen1);
      var pen4: Pen = new Pen();

      expect(pen1.equals(pen1)).to.equal(true);
      expect(pen1.equals(pen2)).to.equal(false);
      expect(pen1.equals(pen3)).to.equal(true);
      expect(pen1.equals(pen4)).to.equal(false);
      expect(pen1.colour === PenColour.Blue).to.equal(true);
      expect(pen1.style === PenStyle.Solid).to.equal(true);

      pen2.assign(pen1);
      expect(pen1.equals(pen2)).to.equal(true);

      pen1.colour = PenColour.Red;
      pen1.style = PenStyle.Dashed;

      expect(pen1.colour === PenColour.Red).to.equal(true);
      expect(pen1.style === PenStyle.Dashed).to.equal(true);

      var caught: boolean = false;
      try {
         var pen5: Pen = new Pen(null as Pen);
      } catch (e) {
         caught = true;
      }
      expect(caught).to.equal(true);
   });

   it("Needs to convert Pen to and from JSON()", function () {

      var pen1: Pen = new Pen(PenColour.Blue, PenStyle.Solid);

      var stream: string = pen1.streamToJSON();

      var pen2: Pen = new Pen(); 

      expect(pen1.equals(pen2)).to.equal(false);

      pen2.streamFromJSON(stream);

      expect(pen1.equals(pen2)).to.equal(true);
   });


});

