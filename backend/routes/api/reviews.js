const express = require('express');
const { Spot, SpotImage, User, Review, ReviewImage, Booking } = require('../../db/models');
const { requireAuth } = require('../../utils/auth')
const { Op } = require('sequelize');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');


const router = express.Router();


// GET ALL REVIEWS BY THE CURRENT USER
router.get('/current', requireAuth, async(req, res) => {
    const userId = req.user.id

    const reviews = await Review.findAll({
        where: {userId},
        include: [
           {
            model: User,
            attributes: ['id', 'firstName', "lastName"]
           },

           {
            model: Spot, 
            attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country',
            'lat','lng', 'name', 'price'],

            include: {
                model: SpotImage,
                where: {preview: true},
                attributes: ['url']
            }
           },

           {
            model: ReviewImage,
            attributes: ['id', 'url']
           }
        ]
    })

    res.json({Reviews: reviews})
})




module.exports = router