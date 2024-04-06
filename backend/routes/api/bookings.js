const express = require('express')
const { check } = require('express-validator')
const { Op } = require("sequelize")
const {requireAuth} = require('../../utils/auth')
const { Spot, SpotImage, User, Review, ReviewImage, Booking } = require('../../db/models');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router()

const validateDates = [
    check('startDate')
        .exists({ checkFalsy: true })
        .custom((value, { req }) => {
            let startDateValidate = new Date(value)
            let currentDate = new Date()

            if (startDateValidate < currentDate) {
                return false
            }
            return true
        })
        .withMessage('startDate cannot be in the past'),
    check('endDate')
        .exists({ checkFalsy: true })
        .custom((value, { req }) => {
            let startDateValidate = new Date(req.body.startDate)
            let endDateValidate = new Date(value)

            if (endDateValidate <= startDateValidate) {
                return false
            }
            return true
        })
        .withMessage('endDate cannot be on or before startDate'),
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


// EDIT A BOOKING 
router.put('/:bookingId', requireAuth, validateDates, async(req, res) => {
    const {startDate, endDate} = req.body;
    const bookingId = req.params.bookingId

    const updatedBooking = await Booking.findByPk(bookingId)

    if(!updatedBooking) {
        return res.status(404).json({
            "message": "Booking couldn't be found"
          })
    }

    if(updatedBooking.userId !== req.user.id) {
        return res.status(403).json({
            message: 'Forbidden you do not have permission to edit this booking'
        })
    }

    const currentDate = new Date()

    if(updatedBooking.endDate <= currentDate) {
        return res.status(403).json({
            "message": "Past bookings can't be modified"
          })
    }
    
    
    const bookingError = await Booking.findOne({
        where: {
            id: {[Op.ne]: bookingId},
            spotId: updatedBooking.spotId,
            startDate: { [Op.lte]: endDate},
            endDate: { [Op.gte]: startDate}

        }
    })

    if(bookingError) {
        return res.status(403).json({
            "message": "Sorry, this spot is already booked for the specified dates",
            "errors": {
              "startDate": "Start date conflicts with an existing booking",
              "endDate": "End date conflicts with an existing booking"
            }
          })
    }

    if (startDate) updatedBooking.startDate = startDate;
    if (endDate) updatedBooking.endDate = endDate;
  
    await updatedBooking.save();


    return res.status(200).json(updatedBooking)

})



router.delete('/:bookingId', requireAuth, async(req, res) => {
    const deletedBooking = await Booking.findByPk(req.params.bookingId)

    if(!deletedBooking) {
        return res.status(404).json({
            "message": "Booking couldn't be found"
          })
    }

    if(deletedBooking.userId !== req.user.id) {
        return res.status(403).json({
            message: 'You do not have authorization to delete this booking'
        })
    }

    const currentDate = new Date()
    if(currentDate >= deletedBooking.startDate) {
        return res.status(403).json({
            
                "message": "Bookings that have been started can't be deleted"
              
        })
    }

    await deletedBooking.destroy()

    return res.status(200).json({
        "message": "Successfully deleted"
      })
})





module.exports = router