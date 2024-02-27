'use strict';

/** @type {import('sequelize-cli').Migration} */

const { SpotImage } = require('../models')

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

    await SpotImage.bulkCreate([

      {
        spotId: 1,
        url: 'floridabeachimage.com',
        preview: true, 
      },
      {
        spotId: 2,
        url: 'floridafishingimage.com',
        preview: true, 
      },
      {
        spotId: 3,
        url: 'floridareptilesimage.com',
        preview: true, 
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
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, {}, {});
  }
};
