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
        url: 'https://res.cloudinary.com/dstnyoxvl/image/upload/v1713639032/zBnb%20photoes/3c2099efc3bdd46c07c360c3f045bede-cc_ft_384_tuomml.webp',
        preview: true, 
      },
      {
        spotId: 2,
        url: 'https://res.cloudinary.com/dstnyoxvl/image/upload/v1713639018/zBnb%20photoes/0ea24769a9ff59d9f7f3998e659db12c-cc_ft_768_zpdlgf.webp',
        preview: true, 
      },
      {
        spotId: 3,
        url: 'https://res.cloudinary.com/dstnyoxvl/image/upload/v1713569945/zBnb%20photoes/604be855ebd9c187a152b9ca06d4766f-cc_ft_768_m5zgmz.webp',
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
