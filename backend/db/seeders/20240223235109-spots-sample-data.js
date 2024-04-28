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
        description: `Escape to the stunning shores of Destin, Florida, where pristine white sands and emerald waters await you at our exquisite Airbnb rental. Nestled in the heart of this charming coastal town, our vacation home offers the perfect blend of luxury and relaxation. Step inside to discover a beautifully appointed interior, featuring spacious living areas, stylish decor, and all the amenities you need for a memorable stay. Whether you're lounging in the sun-drenched living room, cooking up a feast in the gourmet kitchen, or sipping cocktails on the private balcony with breathtaking views of the Gulf of Mexico, you'll feel right at home in our coastal oasis.Outside your door, you'll find endless opportunities for adventure and relaxation. Spend your days soaking up the Florida sunshine on the nearby beaches, where you can swim, snorkel, or simply unwind with a good book. Explore the vibrant local dining scene, indulge in fresh seafood, or take a sunset cruise along the coast for a truly unforgettable experience. With its prime location and upscale amenities, our Destin Airbnb promises a vacation like no other, where every moment is filled with warmth, comfort, and seaside charm.`,
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
        description: `Escape to the serene shores of Hilton Head Island, where our charming Airbnb awaits to welcome you to a world of relaxation and adventure. Nestled amidst lush greenery and just moments away from the pristine beaches, our cozy rental offers the perfect blend of comfort and convenience. Step inside to discover a beautifully furnished interior, adorned with coastal accents and flooded with natural light. From the inviting living spaces to the fully equipped kitchen, every detail has been thoughtfully curated to ensure a memorable stay. Relax on the private patio surrounded by swaying palms, or take a leisurely stroll to the nearby beach for a day of sun, surf, and sand.

        Outside your doorstep, Hilton Head Island beckons with a wealth of activities and attractions to explore. Tee off at world-class golf courses, embark on a kayaking adventure through scenic waterways, or simply unwind with a sunset cocktail at a waterfront restaurant. With its prime location and laid-back ambiance, our Hilton Head Airbnb is the perfect retreat for families, couples, and solo travelers alike. Whether you're seeking relaxation, adventure, or a bit of both, let our cozy rental be your home away from home on this enchanting island paradise.`,
        
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
        description: `
        Escape to the tropical paradise of Puerto Rico with our exquisite Airbnb rental, where sun-drenched beaches, vibrant culture, and lush landscapes await. Nestled amidst swaying palm trees and just moments away from the crystal-clear waters of the Caribbean Sea, our charming accommodation offers the perfect blend of comfort and luxury. Step inside to discover a beautifully designed interior, featuring modern amenities, stylish decor, and breathtaking views of the surrounding scenery. Whether you're lounging on the private terrace, soaking in the sun by the pool, or exploring the island's rich history and natural wonders, you'll find endless opportunities for relaxation and adventure right at your fingertips.
        
        Outside your door, Puerto Rico beckons with its diverse array of attractions and activities. Spend your days basking on the golden sands of Flamenco Beach, snorkeling among colorful coral reefs, or wandering through the cobblestone streets of Old San Juan. Indulge in mouthwatering cuisine at local eateries, dance the night away to the rhythm of salsa music, or simply unwind with a cocktail as you watch the sunset over the ocean. With its prime location, luxurious amenities, and warm hospitality, our Puerto Rico Airbnb promises an unforgettable island getaway for travelers seeking the ultimate tropical retreat.`,
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
        Nestled in the heart of sunny San Diego, our charming Airbnb offers the perfect blend of comfort, convenience, and coastal charm. Step inside to discover a beautifully appointed interior, featuring stylish decor, modern amenities, and ample space for relaxation. Whether you're unwinding in the cozy living area, preparing delicious meals in the fully equipped kitchen, or enjoying al fresco dining on the private patio, you'll feel right at home in our inviting rental.
        
        Outside your doorstep, San Diego beckons with a wealth of attractions to explore. From world-renowned beaches and vibrant neighborhoods to iconic landmarks and cultural hotspots, there's something for everyone to enjoy. Spend your days soaking up the California sunshine on the sandy shores of Mission Beach, exploring the historic Gaslamp Quarter, or indulging in delicious cuisine at local eateries. With its prime location and comfortable accommodations, our San Diego Airbnb is the perfect home base for your next West Coast adventure.`,
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
