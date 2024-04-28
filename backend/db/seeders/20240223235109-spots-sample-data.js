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
        lat: 38.19011,
        lng: -112.14,
        name: 'Beach House',
        description: `Escape to the stunning shores of Destin, Florida, where pristine white sands and emerald waters await you at our exquisite Airbnb rental.`,
        price: 850
      },
      {
        ownerId: 2,
        address: 'Eglin Beach Resort',
        city: 'Hilton Head',
        state: "South Carolina",
        country: 'United States',
        lat: 78.917,
        lng: -105.812,
        name: 'Luxurious Beach House',
        description: `Escape to the serene shores of Hilton Head Island, where our charming Airbnb awaits to welcome you to a world of relaxation and adventure. `,
        
        price: 650
      },
      {
        ownerId: 3,
        address: '20001 Emerald Coast Pkwy',
        city: 'Ponce',
        state: "Puerto Rico",
        country: 'United States',
        lat: 38.013,
        lng: -1158898,
        name: 'Beach Villa',
        description: `Nestled amid the vibrant culture and breathtaking landscapes of Puerto Rico, our Airbnb offers an unforgettable retreat for travelers seeking a blend of relaxation and adventure.`,
        price: 950
      },
      {
        ownerId: 3,
        address: '20210 Fresh Avenue',
        city: 'San Diego',
        state: "California",
        country: 'United States',
        lat: 56.9324,
        lng: -123.8898,
        name: 'Beach Villa',
        description: `
        Nestled in the heart of sunny San Diego, our charming Airbnb offers the perfect blend of comfort, convenience, and coastal charm.`,
        price: 950
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
