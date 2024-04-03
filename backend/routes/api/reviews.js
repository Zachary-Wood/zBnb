const express = require('express');
const { Spot, SpotImage, User, Review, ReviewImage, Booking } = require('../../db/models');
const { requireAuth } = require('../../utils/auth')
const { Op } = require('sequelize');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');


const router = express.Router();


const validateReview = [
    check('stars')
        .exists({ checkFalsy: true })
        .isInt({ min: 1, max: 5 })
        .withMessage('Stars must be an integer from 1 to 5'),
    check('review')
        .exists({ checkFalsy: true })
        .isLength({ min: 1 })
        .withMessage('Review text is required'),
];


// GET ALL REVIEWS BY THE CURRENT USER
router.get('/current', requireAuth, async (req, res) => {
        const userId = req.user.id;

        const reviews = await Review.findAll({
            where: { userId },
            include: [
                {
                    model: User,
                    attributes: ['id', 'firstName', 'lastName']
                },
                {
                    model: Spot,
                    attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price'],
                    include: [{
                            model: SpotImage,
                            attributes: ['url']
                             }]
                },
                {
                    model: ReviewImage,
                    attributes: ['id', 'url']
                }
            ]
        });
        
        const reviewList = reviews.map((review) => {
            const reviewJSON = review.toJSON();
            if (!reviewJSON.Spot.SpotImages.length) {
              reviewJSON.Spot.previewImage = "No preview image found";
            } else {
              reviewJSON.Spot.previewImage = reviewJSON.Spot.SpotImages[0].url;
            }
      
            delete reviewJSON.Spot.SpotImages;
            return reviewJSON;
          });
    
    res.json({ Reviews: reviewList });
});



// ADD A REVIEW IMAGE BASED ON ID
router.post('/:reviewId/images', requireAuth, async(req, res) => {
    const reviewId = req.params.reviewId

    const {url} = req.body


    const review = await Review.findByPk(reviewId)


    if(review.userId !== req.user.id) {

        return res.status(403).json({
            message: "Forbidden",
        });
    }

    if(!review) {
        res.status(404).json({
            "message": "Review couldn't be found"
          })
    }

    const maxImages = 10
    const imageCount = await ReviewImage.count({where: {reviewId: reviewId}})
    if(imageCount > maxImages) {
        return res.status(403).json({
            "message": "Maximum number of images for this resource was reached"
          })
    }


    const reviewImage = await ReviewImage.create({
        reviewId,
        url
    })

    return res.json({
        id: reviewImage.id,
        url: reviewImage.url
    })
})

// EDIT A REVIEW BASED ON ID
router.put('/:reviewId', requireAuth, validateReview,  async(req, res) => {

    const reviewId = req.params.reviewId
    const findReview = await Review.findByPk(reviewId)
    const {review, stars} = req.body

    if(!findReview) {
        return res.status(404).json({
            "message": "Review couldn't be found"
          })
    }

    if(findReview.userId !== req.user.id) {

        return res.status(403).json({
            message: "Forbidden",
        });
    }

    const updatedReview = await findReview.update({
        review,
        stars
    })

    return res.json(updatedReview)


})

//DELETE A REVIEW
router.delete('/:reviewId', requireAuth, async(req, res) => {
    const reviewId = req.params.reviewId
    const review = await Review.findByPk(reviewId)

    if(!review){
        return res.status(404).json({
            "message": "Review couldn't be found"
          })
    }

    if(review.userId !== req.user.id) {
        return res.status(403).json({
            message: "Forbidden",
        });
    }

    await review.destroy()
    res.status(200).json({
        "message": "Successfully deleted"
      })
})





module.exports = router