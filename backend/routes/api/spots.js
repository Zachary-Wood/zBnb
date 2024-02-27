const express = require("express")
const { Op } = require('sequelize')
const route = require("./session")
const { requireAuth, handleValidationErrors } = require("../../utils/auth")


const { Spot, Review, SpotImage , User} = require("../../db/models");


const router = express.Router()


// const validateSpot = [
//     check('address')
//     .exists({ checkFalsy: true })
//     .isLength({ min: 10 , max: 50})
//     .message("Street address is required"),
//     check('city')
//     .exists({ checkFalsy: true })
//     .isLength({ min: 3 , max: 30})
//     .message("Street address is required"),
//     check('state')
//     .exists({ checkFalsy: true })
//     .isLength({ min: 3 , max: 30})
//     .message("State is required"),
//     check('country')
//     .exists({ checkFalsy: true })
//     .isLength({ min: 3 , max: 30})
//     .message("Country is required"),
//     check('lat')
//     .exists({ checkFalsy: true })
//     .message("Latitude must be within -90 and 90"),
//     check('lng')
//     .exists({ checkFalsy: true })
//     .message("Longitude must be within -180 and 180"),
//     check('name')
//     .exists({ checkFalsy: true })
//     .isLength({ min: 5 , max: 100})
//     .message("Longitude must be within -180 and 180"),
//     check('description')
//     .exists({ checkFalsy: true })
//     .message("Description is required"),
//     check('price')
//     .exists({ checkFalsy: true })
//     .message("Price per day must be a positive number"),
//     handleValidationErrors

    
    
// ]


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

//get all current users spots
 router.get('/current', async(req,res) => {
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


        


        res.status(200).json(spotJson)
 })










    




module.exports = router