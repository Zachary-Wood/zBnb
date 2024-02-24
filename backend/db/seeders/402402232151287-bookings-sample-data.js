'use strict';

/** @type {import('sequelize-cli').Migration} */

const { Booking } = require('../models')

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

    await Booking.bulkCreate([
      {
        spotId: 1,
        userId: 1,
        startDate: '2024-03-07',
        endDate: '2024-03-14',
      },
      {
        spotId: 2,
        userId: 2,
        startDate: '2024-04-05',
        endDate: '2024-04-12',
      },
      {
        spotId: 3,
        userId: 3,
        startDate: '2024-04-19',
        endDate: '2024-04-26',
      }
  ])




  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    options.tableName = 'Bookings';
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, {}, {});
  }
};
