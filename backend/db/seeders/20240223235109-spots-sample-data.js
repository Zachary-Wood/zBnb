'use strict';

/** @type {import('sequelize-cli').Migration} */

const { Spot } = require('../models')

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}



module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await Spot.bulkCreate([
      {
        ownerId: 1,
        address: '17000 Emerald Coast Pkwy',
        city: 'Destin',
        state: "Florida",
        country: 'United States',
        lat: 23456,
        lng: 98765,
        name: 'Beach House',
        description: 'Here in destin come stay at this beautiful and luxurious beach house. All amendities are included and enjoy the private pool and hot tub right on the beautiful destin beach',
        price: 650
      },
      {
        ownerId: 2,
        address: 'Eglin Beach Park',
        city: 'Destin',
        state: "Florida",
        country: 'United States',
        lat: 78917,
        lng: 39812,
        name: 'Shore House',
        description: 'Here in destin come stay at this wonderful fishing spot. The airbnb comes with a boat and crew to take you out to do whatever you would like in the beautiful destin ocean',
        price: 350
      },
      {
        ownerId: 3,
        address: '20001 Emerald Coast Pkwy',
        city: 'Destin',
        state: "Florida",
        country: 'United States',
        lat: 38013,
        lng: 58898,
        name: 'Gatorland',
        description: 'Here in destin come stay at this wonderful fishing spot. If you love reptiles this is the place for you. This location is a 2 minute walk away from reptile world which is a great and fun spot to see reptiles and aligators',
        price: 175
      },
    ])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, {}, {});
  }
};
