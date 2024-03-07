const express = require('express');
const { Spot, SpotImage, User, Review, ReviewImage, Booking } = require('../../db/models');
const { requireAuth } = require('../../utils/auth')
const { Op } = require('sequelize');
const { check } = require('express-validator');
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



// get all spots 

router.get('/', async(req,res) => {
    const spots = await Spot.findAll({}) 
    
    // set an array of spots to return
    const listOfSpots = [];
    
    spots.forEach(spot => {
        listOfSpots.push(spot.toJSON())
    });
    
    
    // we iterate through our list and add properites to the spot 
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

// post a new spot



//get all current users spots
router.get('/current', requireAuth, async(req,res) => {
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

// get a spot by spotid
router.get('/:spotId', async(req, res) => {
    
    const spot = await Spot.findByPk(req.params.spotId, {
        include: [
            {model: SpotImage,
                attributes: ['id', 'url', 'preview']
            }, 
            
            {model: User,
                as: "Owner",
                attributes: ["id", 'firstName', 'lastName']
            } ]
        })
        const spotJson = spot.toJSON()
        
        const reviews = await Review.count({
            where: {
                spotId: spot.id
            }
        }
        )    
        const totalStars = await Review.sum('stars', {
            where: {spotId: spot.id}
        })
        
        spotJson.avgStarRating = (totalStars / reviews)
        
        if(!spot) res.status(404).json({
            "message": "Spot couldn't be found"
        })
        
        return res.status(200).json(spotJson)
    })
    // create a new post 
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


    // ADD IMAGE TO A SPOT BASED ON ID
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

// EDIT A SPOT BASED ON SPOT ID
router.put('/:spotId', requireAuth, validateSpot, async (req, res) => {
    
    const spot = await Spot.findByPk(req.params.spotId)
    
    if(!spot) {
        res.status(404).json({
            "message": "Spot couldn't be found"
          })
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


router.delete('/:spotId', requireAuth, async(req, res) => {

    const currUser = req.user.id
    const spot = await Spot.findByPk(req.params.spotId)
    
    if(!spot) {
        res.status(404).json({
            "message": "Spot couldn't be found"
          })
    }
    
    if(currUser !== spot.ownerId) {
        res.status(403).json({"message": "You cannot delete this spot"})
    }

    await spot.destroy()
    res.status(200).json({
        "message": "Successfully deleted"
      })

})








module.exports = router