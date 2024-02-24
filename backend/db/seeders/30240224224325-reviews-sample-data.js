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
        review: 'This was an awesome place to stay would recommend to anyone who isnt scared of getting the feet a little sandy!',
        stars: 5
      },
      {
        spotId: 2,
        userId: 2,
        review: 'Horrible service and the people were not very nice we still made fun out of it but it ruined the vibe of our vactation',
        stars: 2
      },
      {
        spotId: 3,
        userId: 3,
        review: 'This place was such a great place for kids. My kids loved it! You got to see so many cool reptiles and the property was beautiful!',
        stars: 5
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
