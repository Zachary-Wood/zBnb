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
        spotId: 1,
        url: 'https://res.cloudinary.com/dstnyoxvl/image/upload/v1713639035/zBnb%20photoes/44dd91db4fb73c64c54bd444ddea6cb9-cc_ft_384_pbrtdv.webp',
        preview: true, 
      },
      {
        spotId: 1,
        url: 'https://res.cloudinary.com/dstnyoxvl/image/upload/v1713639030/zBnb%20photoes/d33af80a181e9b862da205b5743400a9-cc_ft_384_w4yp5d.webp',
        preview: true, 
      },
      {
        spotId: 1,
        url: 'https://res.cloudinary.com/dstnyoxvl/image/upload/v1713639026/zBnb%20photoes/40e48e5da749360fffcec70ee302add1-cc_ft_384_pochv9.webp',
        preview: true, 
      },
      {
        spotId: 1,
        url: 'https://res.cloudinary.com/dstnyoxvl/image/upload/v1714268449/zBnb%20photoes/d0ef99e95f392acc245688c7bee3c52e-cc_ft_768_gwwlpu.webp',
        preview: true, 
      },


      {
        spotId: 2,
        url: 'https://res.cloudinary.com/dstnyoxvl/image/upload/v1713639018/zBnb%20photoes/0ea24769a9ff59d9f7f3998e659db12c-cc_ft_768_zpdlgf.webp',
        preview: true, 
      },
      {
        spotId: 2,
        url: 'https://res.cloudinary.com/dstnyoxvl/image/upload/v1713639015/zBnb%20photoes/9096c493a22717fb5ca33c5c9d4ce48b-uncropped_scaled_within_1536_1152_bqtd1i.webp',
        preview: true, 
      },
      {
        spotId: 2,
        url: 'https://res.cloudinary.com/dstnyoxvl/image/upload/v1713639013/zBnb%20photoes/1de66e2f055b939bf9a8ff9f2d716784-cc_ft_768_yn6wb5.webp',
        preview: true, 
      },
      {
        spotId: 2,
        url: 'https://res.cloudinary.com/dstnyoxvl/image/upload/v1713639020/zBnb%20photoes/e291c780105197c7f301e2918967423f-cc_ft_768_mthvnt.webp',
        preview: true, 
      },
      {
        spotId: 2,
        url: 'https://res.cloudinary.com/dstnyoxvl/image/upload/v1713639023/zBnb%20photoes/930a88a0c5b0b0ba05e84e66e97414f8-cc_ft_384_qksagy.webp',
        preview: true, 
      },
      {
        spotId: 3,
        url: 'https://res.cloudinary.com/dstnyoxvl/image/upload/v1713569945/zBnb%20photoes/604be855ebd9c187a152b9ca06d4766f-cc_ft_768_m5zgmz.webp',
        preview: true, 
      }, 
      {
        spotId: 3,
        url: 'https://res.cloudinary.com/dstnyoxvl/image/upload/v1713569881/zBnb%20photoes/ea43563a253f1b44f5fdb29a1c6ed39b-cc_ft_768_n5wqmu.webp',
        preview: true, 
      },
      {
        spotId: 3,
        url: 'https://res.cloudinary.com/dstnyoxvl/image/upload/v1713569940/zBnb%20photoes/034620e87d3f289126406d474f6baa91-cc_ft_768_nof3ch.webp',
        preview: true, 
      },
      {
        spotId: 3,
        url: 'https://res.cloudinary.com/dstnyoxvl/image/upload/v1713569938/zBnb%20photoes/2912c1cc516f38133b14636dbaef1873-cc_ft_384_wwdprs.webp',
        preview: true, 
      },
      {
        spotId: 3,
        url: 'https://res.cloudinary.com/dstnyoxvl/image/upload/v1714269336/zBnb%20photoes/bfac8760b864deff0d62ee5a26df7761-cc_ft_384_m4huba.webp',
        preview: true, 
      },


      {
        spotId: 4,
        url: 'https://res.cloudinary.com/dstnyoxvl/image/upload/v1713808574/zBnb%20photoes/9d91de1404532d217e98e1cd08c42a79-cc_ft_384_w7qmk5.webp',
        preview: true, 
      },
      {
        spotId: 4,
        url: 'https://res.cloudinary.com/dstnyoxvl/image/upload/v1713808598/zBnb%20photoes/e6043db5b47b27dd576cbef56e405690-cc_ft_384_lthrtd.webp',
        preview: true, 
      },
      {
        spotId: 4,
        url: 'https://res.cloudinary.com/dstnyoxvl/image/upload/v1713808619/zBnb%20photoes/e19937101c6af0f7b7de5d63f114b899-cc_ft_768_jla4o2.webp',
        preview: true, 
      },
      {
        spotId: 4,
        url: 'https://res.cloudinary.com/dstnyoxvl/image/upload/v1713808638/zBnb%20photoes/cde01901b3d9158aa00d9a702770b9b9-cc_ft_384_fnaaio.webp',
        preview: true, 
      },
      {
        spotId: 4,
        url: 'https://res.cloudinary.com/dstnyoxvl/image/upload/v1713808661/zBnb%20photoes/260394e5080dc5a16c8cf979be6be83b-cc_ft_768_zwav5m.webp',
        preview: true, 
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
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, {}, {});
  }
};
