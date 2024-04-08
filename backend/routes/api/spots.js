const express = require('express');
const { Spot, SpotImage, User, Review, ReviewImage, Booking } = require('../../db/models');
const { requireAuth } = require('../../utils/auth')
const { Op } = require('sequelize');
const { check , query, validationResult } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();

// middle wear to check and make sure spot has valid data 
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
        .isFloat({ min: -90, max: 90 })
        .withMessage('Latitude must be within -90 and 90'),
    check('lng')
        .isFloat({ min: -180, max: 180 })
        .withMessage('Longitude must be within -180 and 180'),
    check('name')
        .isLength({ max: 50 })
        .withMessage('Name must be less than 50 characters'),
    check('description')
        .notEmpty()
        .withMessage('Description is required'),
    check('price')
        .isFloat({ min: 0 })
        .withMessage('Price per day must be a positive number'),
    handleValidationErrors
];

// review middleware to make sure reviews have the right data
const validateReview = [
    check('stars')
        .exists({ checkFalsy: true })
        .isInt({ min: 1, max: 5 })
        .withMessage('Stars must be an integer from 1 to 5'),
    check('review')
        .exists({ checkFalsy: true })
        .isLength({ min: 1 })
        .withMessage('Review text is required'),
        handleValidationErrors
];

// query middleware 
const checkQuery = [
    query("page")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Page must be greater than or equal to 1"),
    query("size")
      .optional()
      .isInt({ min: 1 , max: 20})
      .withMessage("Size must be greater than or equal to 1 and smaller than 20"),
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


  const formatAmericanDate = (date) => {
    const formattedDate = new Date(date);
    const month = formattedDate.getMonth() + 1;
    const day = formattedDate.getDate();
    const year = formattedDate.getFullYear();
    const hours = formattedDate.getHours();
    const minutes = formattedDate.getMinutes();
    const sec = formattedDate.getSeconds();
    return `${month}/${day}/${year} ${hours}:${minutes}:${sec}`;
  };
  
  // middleware to validate that the dates inputed arent in the past and that the end data isnt before the startdate with validation errors 
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

// GET ALL SPOTS
router.get('/', checkQuery, async(req,res) => {
    let {page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice} = req.query // grab all pagination items from body to be used later 

    page = parseInt(page) || 1; 
    size = parseInt(size) || 20;

    if(page > 10) page = 10 // make sure page cant be greater than 10
    if(size > 20) size = 20 // make sure size cant be bigger than 20 

    let pagination = { // pagination ibject to spread in query with the size and page
        limit: size,
        offset: size * (page - 1)
    }

    let itemsObj = { // object that holds all of the items data 
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
    
    // make each spot in the array json so we can count 
    spots.forEach(spot => {
        listOfSpots.push(spot.toJSON())
    });
    
    // we iterate through our list and add properites to the spot 
    for(let spot of listOfSpots) {
        const reviews = await Review.count({ // we count the amount of reviews with the same spot id 
            where: { spotId: spot.id }
        }
        )    
        const totalStars = await Review.sum('stars', { // add up the total number of stars with the same spot id
            where: {spotId: spot.id}
        })
        
        spot.avgRating = (totalStars / reviews) // find the average
      
        let previewImage = await SpotImage.findOne({ // find an image where the spot id matches and is true
            where: {spotId: spot.id, preview: true},
        })

        if(previewImage){ // if there is an image we set it to that value, if not we send back no image provided 
            spot.previewImage = previewImage.url
        } else {
            spot.previewImage = 'No image provided'
        }
        
    }

    const payload = listOfSpots.map((spot) => {
        return {
        
            
            id: spot.id,
            ownerId: spot.ownerId,
            address: spot.address,
            city: spot.city,
            state: spot.state,
            country: spot.country,
            lat: +spot.lat,
            lng: +spot.lng, 
            name: spot.name,
            description: spot.description,
            price: +spot.price,
            createdAt: formatAmericanDate(spot.createdAt),
            updatedAt: formatAmericanDate(spot.updatedAt),
            avgRating: spot.avgRating || 0,
            previewImage: spot.previewImage || 'No image Provided'
            
        }
    })
    let finalPayload = {Spots: payload}

    finalPayload.page = +page
    finalPayload.size = size
    
    res.status(200).json(finalPayload) // success code and send back result object
});

// GET ALL CURRENT USERS
router.get('/current', requireAuth, async(req,res) => {
    
    const spot = await Spot.findByPk(req.params.spotId) // find the spot of the current user 

    const spots = await Spot.findAll({ // find all the spots that match the ownerId to the user that sent a request
        where: { ownerId: req.user.id }
    }) 
    
    // set an array of spots to return
    const listOfSpots = [];
    
    // iterate through our spots and set it to jsoon and push to an array to iterate through later
    spots.forEach(spot => {
        listOfSpots.push(spot.toJSON())
    });
    
    
    
    for(let spot of listOfSpots) { // iteate through our array or our spots in json format 
        const reviews = await Review.count({ // add up the amount of reviews that match the spot id
            where: {
                spotId: spot.id
            }
        })  

        const totalStars = await Review.sum('stars', { // add up all the stars that match the spot id 
            where: {spotId: spot.id}
        })
        
        if(reviews > 0) {
            spot.avgStarRating = (totalStars / reviews) // get average of stars on a spot
         } else {
            spot.avgStarRating = 'No ratings yet'
         }
        
        if(spot.SpotImage) { // if theres an image we provide the url if not we send back no image provided
            spot.SpotImage.PreviewImage.url
        } else {
            spot.PreviewImage = 'No image provided'
        }
        
    }


    const payload = listOfSpots.map((spot) => {
        return {
            id: spot.id,
            ownerId: spot.ownerId,
            address: spot.address,
            city: spot.city,
            state: spot.state,
            country: spot.country,
            lat: +spot.lat,
            lng: +spot.lng, 
            name: spot.name,
            description: spot.description,
            price: +spot.price,
            createdAt: formatAmericanDate(spot.createdAt),
            updatedAt: formatAmericanDate(spot.updatedAt),
            avgRating: spot.avgRating || 0,
            previewImage: spot.previewImage || 'No image provided'
            
        }
    })
    let finalPayload = {Spots: payload}
    
    res.status(200).json(finalPayload) 
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
            lat: +spot.lat,
            lng: +spot.lng, 
            name: spot.name,
            description: spot.description,
            price: +spot.price,
            createdAt: formatAmericanDate(spot.createdAt),
            updatedAt: formatAmericanDate(spot.updatedAt),
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


// POST A NEW SPOT
router.post('/',requireAuth, validateSpot, async(req, res) => {
    
const {address, city, state, country, lat, lng, name, description, price} = req.body // destructure all items needed to create a spot
   
    const newSpot = await Spot.create({ //  we create a new spot and store it to be jsoned 
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

    const payload = {
        
            
        id: newSpot.id,
        ownerId: newSpot.ownerId,
        address: newSpot.address,
        city: newSpot.city,
        state: newSpot.state,
        country: newSpot.country,
        lat: +newSpot.lat,
        lng: +newSpot.lng, 
        name: newSpot.name,
        description: newSpot.description,
        price: +newSpot.price,
        createdAt: formatAmericanDate(newSpot.createdAt),
        updatedAt: formatAmericanDate(newSpot.updatedAt),
        
    }
    return res.status(201).json(payload) 
})



// ADD AN IMAGE TO SPOT BASED ON ID
router.post('/:spotId/images', requireAuth, async (req, res) => {
    let currUser = req.user // we get the current user 


    const spot = await Spot.findByPk(req.params.spotId) // find the spot that is provided wit the id

    if(!spot) { // if there is no id that matches throw error 
       return res.status(404).json({ "message": "Spot couldn't be found"})
    }

    if(currUser.id !== spot.ownerId) { // user needs to match the spot ownerd id and throw error if not 
        return res.status(403).json({"message": "forbidden you do not own this spot"})
    }

    const {url, preview} = req.body // we grab the two attributes we need to create a new spot image 

    const newSpotImage = await SpotImage.create({ // we create a new image 
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




// EDIT A SPOT BASED ON SPOT ID
router.put('/:spotId', requireAuth, validateSpot, async (req, res) => {
    
    
    const spotId = req.params.spotId
    const spot = await Spot.findByPk(spotId)
    
    if(!spot) {
        res.status(404).json({
            "message": "Spot couldn't be found"
          })
    }

    if(req.user.id !== spot.ownerId) {
        res.status(403).json({"message": "forbidden you do not own this spot"})
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

    
    const formattedPayload = {
        id: updatedSpot.id,
        ownerId: updatedSpot.ownerId,
        address: updatedSpot.address,
        city: updatedSpot.city,
        state: updatedSpot.state,
        country: updatedSpot.country,
        lat: updatedSpot.lat,
        lng: updatedSpot.lng,
        name: updatedSpot.name,
        description: updatedSpot.description,
        price: +updatedSpot.price,
        createdAt: formatAmericanDate(updatedSpot.createdAt),
        updatedAt: formatAmericanDate(updatedSpot.updatedAt)
    }


    return res.status(200).json(formattedPayload)
})

// DELETE A SPOT
router.delete('/:spotId', requireAuth, async(req, res) => {

    const user = req.user
    const spotId = req.params.spotId
   
    const deletedSpot = await Spot.findByPk(spotId)
    
    if(!deletedSpot) {
        return res.status(404).json({
            "message": "Spot couldn't be found"
          })
    }
    
    if(deletedSpot.ownerId !== user.id) {
       return res.status(403).json({"message": "forbidden you do not own this spot"})
    }

    await deletedSpot.destroy()
    
    return res.status(200).json({
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

   
    
    return res.status(200).json({Reviews: reviews})
})


// POST A NEW REVIEW BASED ON SPOT ID
router.post('/:spotId/reviews', requireAuth, validateReview, async(req, res) => {
    const {review, stars} = req.body
   
    const userId = req.user.id
    const spotId = parseInt(req.params.spotId)

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
    
    res.status(201).json({
        id: +newUserReview.id,
        userId: +newUserReview.userId,
        spotId: +newUserReview.spotId,
        review: newUserReview.review,
        stars: newUserReview.stars,
        createdAt: formatAmericanDate(newUserReview.createdAt),
        updatedAt: formatAmericanDate(newUserReview.updatedAt)

    })
})


// GET ALL BOOKINGS FOR A SPOT BASED ON SPOT ID
router.get('/:spotId/bookings', requireAuth, async(req, res) => {

        
    const user = req.user.id 
    const spotId = parseInt(req.params.spotId)
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
        let items = await Booking.findAll({ // we get an array of all bookings 
            where: {spotId: spotId},
            include: [
                {
                model: User,
                attributes: 
                ['id', 
                'firstName', 
                'lastName'],
                }
        ],
            
        }) 
        // console.log(items);
     
        bookings = items.map((booking) => ({ // we iterate through our array to get each booking
            
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
        // not logged in user
        bookings = await Booking.findAll({
            where: {spotId: spotId},
            attributes: 
            ['spotId', 
            'startDate', 
            'endDate']
        })
        // console.log(bookings);
    }
    return res.status(200).json({Bookings: bookings}) // send a response of whatever condition is hit
}) 


// CREATE A BOOKING BASED ON SPOT ID
router.post('/:spotId/bookings', requireAuth, validateDates, async(req, res) => {
const {startDate, endDate} = req.body // get start date and end date from the body to use

const spot = await Spot.findByPk(req.params.spotId) // find the spot that matched the req

if(!spot) {  // needs to be a valid spot
    return res.status(404).json({
        "message": "Spot couldn't be found"
      })
}

if(spot.ownerId === req.user.id) { // needs to match up with ownerId and user.id
    return res.status(403).json({
        message: "You cannot book your own spot!"
    })
}

const checkStartDate = await Booking.findOne({ // check to see if we have a booking at that spot id the is greater or less than the start date
    where: {
        spotId: spot.id,
        startDate: { [Op.lte]: startDate},
        endDate: { [Op.gte]: startDate}
    }
})

if(checkStartDate) { // if we find a booking that uses those date 
    // create a new error that its already book 
    const error = new Error("Sorry, this spot is already booked for the specified dates")

    // add a key to the error object with an explination of what went wrong
    error.error = {
        "startDate": "Start date conflicts with an existing booking"
    };
    
    return res.status(403).json({
        message: error.message,
        errors: error.error
    })
}

const checkEndDate = await Booking.findOne({ // check the end date to see if it conflicts with any other booking
    where: {
        spotId: spot.id,
        startDate: { [Op.lte]: endDate},
        endDate: { [Op.gte]: endDate}
    }
})

if(checkEndDate) {
    // if it conflicts with it we create a new error
    const error = new Error("Sorry, this spot is already booked for the specified dates")

    error.error = {
        // add a key to the error object with an explination of what went wrong
        "endDate": "End date conflicts with an existing booking"
    };
    
    return res.status(403).json({
        message: error.message, // format the response witht the message that its booked 
        errors: error.error // explanatin of which part threw the error 
    })
}

const checkStartAndEnd = await Booking.findOne({ // check both start and end date
    
        where: {
            spotId: spot.id,
            startDate: { [Op.gte]: startDate},
            endDate: { [Op.lte]: endDate}
        }
    
})

if(checkStartAndEnd) {
    // if they both conflict with another booking we create an error 
    const error = new Error("Sorry, this spot is already booked for the specified dates")

    error.error = {
        // add a key with an explantion of what went wrong 
        "startDate": "Dates conflict with an existing booking"
    };
    
    return res.status(403).json({
        message: error.message, // formatting error response with message and the error that occured
        errors: error.error
    })
}

const newBooking = await Booking.create({ // if there is no errors we create the new booking 
    spotId: spot.id,
    userId: req.user.id,
    startDate,
    endDate
})

// console.log('new bookings', newBooking);
return res.status(200).json(newBooking)


}) 



module.exports = router