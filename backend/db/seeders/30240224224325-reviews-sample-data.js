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
        review: `"From the moment we arrived at this stunning Destin Airbnb, we knew we were in for a treat. The location couldn't have been more perfect, 
        with easy access to the beautiful beaches and all the local attractions. The interior of the rental was simply breathtaking – 
        spacious, immaculately decorated, and equipped with every modern convenience we could have hoped for. We loved lounging in the sunlit living room, cooking meals in the gourmet kitchen, 
        and savoring morning coffee on the private balcony overlooking the Gulf of Mexico.`,
        stars: 5
      },
      {
        spotId: 2,
        userId: 2,
        review: `
        "Our stay at this Hilton Head Airbnb was nothing short of magical. From the moment we arrived, we were greeted with warm hospitality and a sense of tranquility that instantly put us at ease. The rental itself was beautifully appointed, with every detail carefully considered to ensure our comfort and enjoyment. We loved spending lazy mornings sipping coffee on the private patio, surrounded by lush greenery and the gentle sounds of nature. The proximity to the beach was a definite highlight, allowing us to easily access the pristine shores for long walks and peaceful moments by the water.`,
        stars: 2
      },
      {
        spotId: 3,
        userId: 3,
        review: `Our stay at this Puerto Rico Airbnb was an absolute dream come true. From the moment we arrived, we were greeted with warm hospitality and a sense of tranquility that instantly put us at ease. The property exceeded all expectations, with a beautifully designed interior that felt like a true home away from home. Every detail was carefully curated, from the stylish decor to the modern amenities, ensuring a comfortable and memorable stay.

        The location was simply perfect, offering breathtaking views of the Caribbean Sea and easy access to all the island's attractions. We spent our days lounging by the pool, exploring the nearby beaches, and immersing ourselves in the vibrant culture of Puerto Rico. The hosts were incredibly attentive and went above and beyond to ensure we had everything we needed for a fantastic vacation. Overall, our experience at this Puerto Rico Airbnb was nothing short of magical, and we can't wait to return for another unforgettable getaway.`,
        stars: 5
      }, 
      {
        spotId: 4,
        userId: 3,
        review: `"Our experience at this San Diego Airbnb was far from satisfactory. From the moment we arrived, we were disappointed by the lack of cleanliness and maintenance throughout the rental. The interior appeared tired and worn, with outdated furnishings and noticeable signs of neglect. The promised amenities were either missing or in poor condition, making our stay uncomfortable and inconvenient.

        Furthermore, the location of the Airbnb did not meet our expectations. While it was advertised as being centrally located, it was actually quite far from the attractions and amenities we had hoped to visit. Additionally, the neighborhood felt unsafe and unwelcoming, leaving us feeling uneasy during our time there. Overall, our stay at this San Diego Airbnb was a regrettable experience, and we would not recommend it to others seeking accommodation in the area."`,
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
