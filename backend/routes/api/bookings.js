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

router.put('/:bookingId', requireAuth, async(req, res) => {
    const {startDate, endDate} = req.body;

    const bookingToUpdate = await Booking.findByPk(req.params.bookingId)

    if(!bookingToUpdate) {
        return res.status(404).json({
            "message": "Booking couldn't be found"
          })
    }

    if(bookingToUpdate.userId !== req.user.id) {
        return res.status(403).json({
            message: 'You do not have permission to edit this booking'
        })
    }

    const currentDate = new Date()

    if(bookingToUpdate.endDate <= currentDate) {
        return res.status(400).json({
            "message": "Past bookings can't be modified"
          })
    }

    const spot = await Spot.findOne({
        where: {
            id: bookingToUpdate.spotId,
        }
    })

    const checkStartDate = Booking.findOne({
        where: {
            spotId: spot.id,
            startDate: { [Op.lte]: startDate },
            endDate: { [Op.gte]: startDate },

        }
    })

    if(checkStartDate) {
        const error = new Error(
            '"Sorry, this spot is already booked for the specified dates"'
        )
        error.error = {
            startDate: "Start date conflicts with an existing booking"
        }

        return res.status(403).json({
            message: error.message,
            errors: error.error
        }) 
    }

    const checkEndDate = Booking.findOne({
        where: {
            spotId: spot.id,
            startDate: { [Op.lte]: endDate },
            endDate: { [Op.gte]: endDate },
        }
    })

    if(checkEndDate) {
        const error = new Error(
            '"Sorry, this spot is already booked for the specified dates"'
        )
        error.error = {
            endDate: "End date conflicts with an existing booking"
        }

        return res.status(403).json({
            message: error.message,
            errors: error.error
        }) 
    }

    const checkBothDates = Booking.findOne({
        where: {
            spotId: spot.id,
            startDate: { [Op.gte]: startDate },
            endDate: { [Op.lte]: endDate },
        }
    })

    if(checkBothDates) {
        const error = new Error(
            '"Sorry, this spot is already booked for the specified dates"'
        )
        error.error = {
            startDate: "Dates conflict with an existing booking"
        }

        return res.status(403).json({
            message: error.message,
            errors: error.error
        }) 
    }

    const updatedBooking= await spot.update({
        startDate,
        endDate
    })


    return res.status(200).res.json(updatedBooking)

})





module.exports = router