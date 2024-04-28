'use strict';

/** @type {import('sequelize-cli').Migration} */

const { Review } = require('../models')

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

    await Review.bulkCreate([


      {
        spotId: 1,
        userId: 1,
        review: `"From the moment we arrived at this stunning Destin Airbnb, we knew we were in for a treat. The location couldn't have been more perfect.`,
        stars: 5
      },
      {
        spotId: 2,
        userId: 2,
        review: `
        "Our stay at this Hilton Head Airbnb was nothing short of magical.`,
        stars: 2
      },
      {
        spotId: 3,
        userId: 3,
        review: `Our stay at this Puerto Rico Airbnb was an absolute dream come true.`,
        stars: 5
      }, 
      {
        spotId: 4,
        userId: 3,
        review: `"Our experience at this San Diego Airbnb was far from satisfactory."`,
        stars: 1
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

    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, {}, {});
  }
};
