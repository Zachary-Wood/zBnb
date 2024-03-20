const express = require('express')
const { check } = require('express-validator')
const { Op } = require("sequelize")
const {requireAuth} = require('../../utils/auth')
const { Spot, SpotImage, User, Review, ReviewImage, Booking } = require('../../db/models');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router()


const validateBookingDates = [
    check('startDate')
    .exists({checkFalsy: true})
    .custom((day, {req}) => {
        let startingDate = new Date(day)
        let currentDate = new Date()

        if(startingDate < currentDate) {
            return false
        }
        return true
    })
    .withMessage('Start Date Cannot be before the todays date'),
    

    check('endDate')
    .exists({checkFalsy: true})
    .custom((day, {req}) => {
        let startingDate = new Date(req.body.startingDate)
        let endDate = new Date(day)

        if(endDate <= startingDate) {
            return false
        }
        return true
    })
    .withMessage('Enddate cannot be before start date'),
    handleValidationErrors
];

// GET BOOKINGS FROM CURRENT USER
router.get('/current', requireAuth, async (req, res) => {
    const userId = req.user.id // we get the current user
    
    const bookings = await Booking.findAll({ // we find all the bookings under the current user
        where: {
            userId
        },
        include: {
            model: Spot,
            attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country',
            'lat', 'lng', 'name', 'price'],
            include: [
                {
                    model: SpotImage,
                    attributes: ['url'],
                }
            ]
        }
    })
    
    let listOfBookings = []; // an array to hold all of our bookings
    for(let booking of bookings) { // we iterate through each booking to find a preview image and to add to our array
        let previewImage
        if(booking.SpotImage) {
            previewImage =booking.SpotImage.PreviewImage.url
        } else {
            previewImage = booking.PreviewImage = 'No image provided'
        }
        
        listOfBookings.push({ // our object of items to push 
            id: booking.id,
            spotId: booking.spotId,
            Spot: {
                id: booking.Spot.id, 
            ownerId: booking.Spot.ownerId,
            address: booking.Spot.address,
            city: booking.Spot.city,
            state: booking.Spot.state,
            country: booking.Spot.country,
            lat: +booking.Spot.lat,
            lng: +booking.Spot.lng,
            name: booking.Spot.name,
            price: +booking.Spot.price,
            previewImage,
        },
            userId, 
            startDate: new Date(booking.startDate).toLocaleDateString(), // creates a normal date like 3/2/2004
            endDate: new Date(booking.endDate).toLocaleDateString(),
            createdAt: new Date(booking.createdAt).toLocaleDateString(),
            updatedAt: new Date(booking.updatedAt).toLocaleDateString()

        });
        }

    return res.status(200).json({ Bookings: listOfBookings})
})





module.exports = router