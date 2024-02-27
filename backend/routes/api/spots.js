const express = require("express")
const { Op } = require('sequelize')
const route = require("./session")
const { requireAuth } = require("../../utils/auth")


const { Spot, Review, SpotImage , User} = require("../../db/models");


const router = express.Router()


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
        spot.avgRating = (totalStars / reviews)

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
        spot.avgRating = (totalStars / reviews)

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
        const reviews = await Review.count({
          where: {
              spotId: spot.id
          }
       }
      )    
      const totalStars = await Review.sum('stars', {
          where: {spotId: spot.id}
      })
      spot.avgRating = (totalStars / reviews)


        if(!spot) res.status(404).json({
            "message": "Spot couldn't be found"
          })


        


        res.status(200).json(spot)
 })










    




module.exports = router