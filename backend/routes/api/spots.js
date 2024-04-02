const express = require('express');
const { Spot, SpotImage, User, Review, ReviewImage, Booking } = require('../../db/models');
const { requireAuth } = require('../../utils/auth')
const { Op } = require('sequelize');
const { check , query, validationResult } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();



  const validateSpot = [
    check('address')
        .notEmpty()
        .withMessage('Street address is required'),
    check('city')
        .notEmpty()
        .withMessage('City is required'),
    check('state')
        .notEmpty()
        .withMessage('State is required'),
    check('country')
        .notEmpty()
        .withMessage('Country is required'),
    check('lat')
        .isDecimal({ min: -90, max: 90 })
        .withMessage('Latitude must be within -90 and 90'),
    check('lng')
        .isDecimal({ min: -180, max: 180 })
        .withMessage('Longitude must be within -180 and 180'),
    check('name')
        .isLength({ max: 50 })
        .withMessage('Name must be less than 50 characters'),
    check('description')
        .notEmpty()
        .withMessage('Description is required'),
    check('price')
        .isDecimal({ min: 0 })
        .withMessage('Price per day must be a positive number'),
    handleValidationErrors
];

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

const handleQueryValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
  
    if (!errors.isEmpty()) {
      let errorResponse = {
        message: "Bad Request",
        errors: {},
      };
  
      errors.array().forEach((error) => {
        errorResponse.errors[error.param] = error.msg;
      });
  
      return res.status(400).json(errorResponse);
    }
  
    next();
  };

const checkQuery = [
    query("page")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Page must be greater than or equal to 1"),
    query("size")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Page must be greater than or equal to 1"),
    query("maxLat")
      .optional()
      .isFloat({ min: -90, max: 90 })
      .withMessage("Maximum latitude is invalid"),
    query("minLat")
      .optional()
      .isFloat({ min: -90, max: 90 })
      .withMessage("Minimum latitude is invalid"),
    query("minLng")
      .optional()
      .isFloat({ min: -180, max: 180 })
      .withMessage("Minimum longitude is invalid"),
    query("maxLng")
      .optional()
      .isFloat({ min: -180, max: 180 })
      .withMessage("Maximum longitude is invalid"),
    query("maxPrice")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("Maximum price must be greater than or equal to 0"),
    query("minPrice")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("Minimum price must be greater than or equal to 0"),
      handleValidationErrors
  ];


// GET ALL SPOTS
router.get('/', checkQuery, handleQueryValidationErrors, async(req,res) => {
    let {page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice} = req.body

    page = parseInt(page) || 1;
    size = parseInt(size) || 20;


    if(page > 10) page = 10
    if(size > 20) size = 20

    let pagination = {
        limit: size,
        offset: size * (page - 1)
    }

    let itemsObj = {
        where: {}
    }

    
    if (minLat && maxLat) itemsObj.where.lat = { [Op.between]: [minLat, maxLat] };
    else if (minLat) itemsObj.where.lat = { [Op.gte]: minLat };
    else if (maxLat) queryObj.where.lat = { [Op.lte]: maxLat };

    if (minLng && maxLng) itemsObj.where.lat = { [Op.between]: [minLng, maxLng] };
    else if (minLng) itemsObj.where.lat = { [Op.gte]: minLng };
    else if (maxLng) queryObj.where.lat = { [Op.lte]: maxLng };

    if (minPrice && maxPrice) itemsObj.where.lat = { [Op.between]: [minLng, maxLng] };
    else if (minPrice) itemsObj.where.lat = { [Op.gte]: minPrice };
    else if (maxPrice) itemsObj.where.lat = { [Op.lte]: maxPrice };


    const spots = await Spot.findAll({
        ...pagination,
        ...itemsObj
    }) 
    
    // set an array of spots to return
    const listOfSpots = [];
    
    spots.forEach(spot => {
        listOfSpots.push(spot.toJSON())
    });
    
    
    // we iterate through our list and add properites to the spot 
    for(let spot of listOfSpots) {
        const reviews = await Review.count({
            where: { spotId: spot.id }
        }
        )    
        const totalStars = await Review.sum('stars', {
            where: {spotId: spot.id}
        })
        spot.avgRating = (totalStars / reviews)
      

        let previewImage = await SpotImage.findOne({
            where: {spotId: spot.id, preview: true},
        })

        if(previewImage){
            spot.previewImage = previewImage.url
        } else {
            spot.previewImage = 'No image provided'
        }
        
    }
    let result = {Spots: listOfSpots}
    result.page = +page,
    result.size = size
    res.status(200).json(result)
});

// POST A NEW SPOT
router.post('/',requireAuth, validateSpot, async(req, res) => {
    
const {address, city, state, country, lat, lng, name, description, price} = req.body
   

    
    
    const newSpot = await Spot.create({
        ownerId: req.user.id,
        address,
        city, 
        state,
        country,
        lat,
        lng,
        name, 
        description,
        price
    })
    // console.log(newSpot);
    return res.status(201).json(newSpot)
})

// ADD AN IMAGE TO SPOT BASED ON ID
router.post('/:spotId/images', requireAuth, async (req, res) => {
    let currUser = req.user.id
    const spot = await Spot.findByPk(req.params.spotId)

    if(!spot) {
        res.status(404).json({
            "message": "Spot couldn't be found"
          })
    }

    if(currUser !== spot.ownerId) {
        res.status(403).json({"message": "forbidden"})
    }


    const {url, preview} = req.body

    const newSpotImage = await SpotImage.create({
        spotId: req.params.spotId,
        url,
        preview
    })


    res.status(200).json({
        id: newSpotImage.id,
        url: newSpotImage.url,
        preview: newSpotImage.preview
    })
})



// GET ALL CURRENT USERS
router.get('/current', requireAuth, async(req,res) => {
    
    const spot = await Spot.findByPk(req.params.spotId)

        
    
    const spots = await Spot.findAll({
        where: { ownerId: req.user.id }
    }) 
    
    // set an array of spots to return
    const listOfSpots = [];
    
    spots.forEach(spot => {
        listOfSpots.push(spot.toJSON())
    });
    
    
    
    for(let spot of listOfSpots) {
        const reviews = await Review.count({
            where: {
                spotId: spot.id
            }
        }
        )    
        const totalStars = await Review.sum('stars', {
            where: {spotId: spot.id}
        })
        spot.avgStarRating = (totalStars / reviews)
        
        if(spot.SpotImage) {
            spot.SpotImage.PreviewImage.url
        } else {
            spot.PreviewImage = 'No image provided'
        }
        
    }
    
    res.status(200).json({Spots: listOfSpots})
});

// GET SPOT BY SPOT ID
router.get('/:spotId', async(req, res) => {
    
    const spot = await Spot.findByPk(req.params.spotId, {
        include: [
            {model: SpotImage}, 
            
            {model: User} ,
            
            {model: Review}
        ]
        })
        if(!spot) res.status(404).json({
            "message": "Spot couldn't be found"
        })
        
        const numReviews = await Review.count({
            where: {
                spotId: spot.id
            }
        }

        )   
        let avgStarRating; 
        if(numReviews > 0) {
            const totalStars = await Review.sum('stars', {
                where: {spotId: spot.id}
            })
            avgStarRating = (totalStars / numReviews)

        } else {
            avgStarRating = 'No stars submitted'
        }

        let response = {
            id: spot.id,
            ownerId: spot.User.id,
            address: spot.address,
            city: spot.city,
            state: spot.state,
            country: spot.country,
            lat: spot.lat,
            lng: spot.lng, 
            name: spot.name,
            description: spot.description,
            price: spot.price,
            createdAt: spot.createdAt,
            updatedAt: spot.updatedAt,
            numReviews,
            avgStarRating,
            SpotImages: 
                spot.SpotImages.map(preview => (
                    {id: preview.id, url: preview.url, preview: preview.preview })
                    
                ),
            Owner: {
                id: spot.User.id,
                firstName: spot.User.firstName,
                lastName: spot.User.lastName
            }
            
        }
    
        return res.status(200).json(response)
    })
// GET ALL BOOKINGS FOR A SPOT BASED ON SPOT ID
    router.get('/:spotId/bookings', requireAuth, async(req, res) => {

        
        const user = req.user.id 
        const spotId = req.params.spotId
        // console.log(user);
        // console.log(req.params.spotId);

        const spot = await Spot.findByPk(spotId) 
        // to check to see if there is a spot the req provided
        if(!spot) {
            return res.status(404).json({
                "message": "Spot couldn't be found"
              })
        }

        let bookings // variable to be assigned to if there are logged in or not
        if(user === parseInt(req.params.spotId)) { // check if the user = spots owner
            bookings = await Booking.findAll({ // we get an array of all bookings 
                where: {spotId: spotId},
                include: {
                    model: User,
                    attributes: ['id', 'firstName', 'lastName'],
                },
                
            }) 
         bookings = bookings.map((booking) => ({ // we iterate through our array to get each booking
                
                    User: {
                        id: booking.User.id,
                        firstName: booking.User.firstName,
                        lastName: booking.User.lastName,
        
                    },
                    id: booking.id,
                    spotId: booking.spotId,
                    userId: booking.userId,
                    startDate: booking.startDate,
                    endDate: booking.endDate,
                    createdAt: booking.createdAt,
                    updatedAt: booking.updatedAt
               }))

        } else {
            bookings = await Booking.findAll({
                where: {spotId: spotId},
                attributes: ['spotId', 'startDate', 'endDate']
            })
        }
        return res.status(200).json({Bookings: bookings}) // send a response of whatever condition is hit
}) 


// CREATE A BOOKING BASED ON SPOT ID

router.post('/:spotId/bookings', requireAuth, async(req, res) => {
    const {startDate, endDate} = req.body

    const spot = await Spot.findByPk(req.params.spotId)

    if(!spot) {
        return res.status(404).json({
            "message": "Spot couldn't be found"
          })
    }

    if(spot.ownerId === req.user.id) {
        return res.status(400).json({
            message: "You own this spot!"
        })
    }

    const checkStartDate = await Booking.findOne({
        where: {
            spotId: spot.id,
            startDate: { [Op.lte]: startDate},
            endDate: { [Op.gte]: startDate}
        }
    })

    if(checkStartDate) {
        const error = new Error("Sorry, this spot is already booked for the specified dates")

        error.error = {
            "startDate": "Start date conflicts with an existing booking"
        };
        
        return res.status(403).json({
            message: error.message,
            errors: error.error
        })
    }

    const checkEndDate = await Booking.findOne({
        where: {
            spotId: spot.id,
            startDate: { [Op.lte]: endDate},
            endDate: { [Op.gte]: endDate}
        }
    })

    if(checkEndDate) {
        const error = new Error("Sorry, this spot is already booked for the specified dates")

        error.error = {
            "endDate": "End date conflicts with an existing booking"
        };
        
        return res.status(403).json({
            message: error.message,
            errors: error.error
        })
    }
    
    const checkStartAndEnd = await Booking.findOne({
        
            where: {
                spotId: spot.id,
                startDate: { [Op.gte]: startDate},
                endDate: { [Op.lte]: endDate}
            }
        
    })

    if(checkStartAndEnd) {
        const error = new Error("Sorry, this spot is already booked for the specified dates")

        error.error = {
            "startDate": "Dates conflict with an existing booking"
        };
        
        return res.status(403).json({
            message: error.message,
            errors: error.error
        })
    }

    const newBooking = await Booking.create({
        spotId: spot.id,
        userId: req.user.id,
        startDate,
        endDate
    })

    console.log('new bookings', newBooking);
    return res.status(200).json(newBooking)
    
    
}) 

// EDIT A SPOT BASED ON SPOT ID
router.put('/:spotId', requireAuth, validateSpot, async (req, res) => {
    
    const currUser = req.user.id
    const spot = await Spot.findByPk(req.params.spotId)
    
    if(!spot) {
        res.status(404).json({
            "message": "Spot couldn't be found"
          })
    }

    if(currUser !== spot.ownerId) {
        res.status(403).json({"message": "forbidden"})
    }
    
    const {address, city, state, country, lat, lng, name, description, price, createdAt,
        updatedAt} = req.body


    const updatedSpot = await spot.update({
        address,
        city,
        state, 
        country, 
        lat, 
        lng, 
        name, 
        description, 
        price,
        createdAt,
        updatedAt
    })

    res.json(updatedSpot)
})

// DELETE A SPOT
router.delete('/:spotId', requireAuth, async(req, res) => {

    const currUser = req.user.id
    const spot = await Spot.findByPk(req.params.spotId)
    
    if(!spot) {
        res.status(404).json({
            "message": "Spot couldn't be found"
          })
    }
    
    if(currUser !== spot.ownerId) {
        res.status(403).json({"message": "forbidden"})
    }

    await spot.destroy()
    res.status(200).json({
        "message": "Successfully deleted"
      })

})



// GET REVIEWS BASED ON A SPOT ID
router.get('/:spotId/reviews', async (req, res) => {
    const spotId = req.params.spotId
    
    const spot = await Spot.findByPk(spotId)
    
    if(!spot) {
        return res.status(404).json({
            "message": "Spot couldn't be found"
        })
    }
    
    const reviews = await Review.findAll({
        where: {
            spotId: spotId,
            
        },
        include: [
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            },
            {
                model: ReviewImage,
                attributes: ['id', 'url']
            }
        ]
    })
    res.json({Reviews: reviews})
})


// POST A NEW REVIEW BASED ON SPOT ID
router.post('/:spotId/reviews', requireAuth, validateReview, handleValidationErrors, async(req, res) => {
    const userId = req.user.id
    const spotId = req.params.spotId
    const {review, stars} = req.body

    const spot = await Spot.findByPk(spotId)

    if(!spot) {
        return res.status(404).json({
            "message": "Spot couldn't be found"
          })
    }

    const userReview = await Review.findOne({
        where: {
            spotId: spotId,
            userId: userId
        }
    })
    
    if(userReview) {
        return res.status(500).json({
            "message": "User already has a review for this spot"
          })
    }


    const newUserReview = await Review.create({
        userId: userId,
        spotId: spotId,
        review: review,
        stars: stars
    })
    res.json(newUserReview)
})

//CREATE A NEW BOOKING BASED ON SPOT ID 

module.exports = router