const express = require('express')
const { Op } = require("sequelize")
const {requireAuth} = require('../../utils/auth')
const { Spot, SpotImage, User, Review, ReviewImage, Booking } = require('../../db/models');
const router = express.Router()

// DELETE A REVIEW IMAGE
router.delete('/:imageId', requireAuth, async (req, res) => {
    const user = req.params.user
    const imageId = req.params.imageId
    
    const imageToBeDeleted = await SpotImage.findOne({
        where: {
            id: imageId
        }
    })

    if(!imageToBeDeleted) {
        return res.status(404).json({
            "message": "Spot Image couldn't be found"
          })
    }

    const spot = await Spot.findOne({
        where: {
            id: imageToBeDeleted.spotId
        }
    }) 
    
    if(spot.ownerId !== user.id) {
        return res.status(403).json({
            message: 'You do not have authorization to delete this image'
        })
    }

    await imageToBeDeleted.destroy()

   return res.status(200).json({
        "message": "Successfully deleted"
      })


    
})




module.exports = router
