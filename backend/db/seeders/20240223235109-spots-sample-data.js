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
        description: 'Here in destin come stay at this beautiful and luxurious beach house. All amendities are included and enjoy the private pool and hot tub right on the beautiful destin beach',
        price: 850
      },
      {
        ownerId: 2,
        address: 'Eglin Beach Resort',
        city: 'Miami',
        state: "Florida",
        country: 'United States',
        lat: 78.917,
        lng: -105.812,
        name: 'Luxurious Beach House',
        description: 'Here in destin come stay at this wonderful beach house. With great views that you will dream about for the rest of your lives!',
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
        description: 'Come stay at your dream vacation spot. Enjoy the pool all the ocean with all inclusive and just enjoy beautiful spot in puerto rico',
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
