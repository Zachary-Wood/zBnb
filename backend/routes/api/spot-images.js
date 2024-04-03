const express = require('express')
const { Op } = require("sequelize")
const {requireAuth} = require('../../utils/auth')
const { Spot, SpotImage, User, Review, ReviewImage, Booking } = require('../../db/models');
const router = express.Router()

// DELETE A REVIEW IMAGE
router.delete('/:imageId', requireAuth, async (req, res) => {
    
    const imageToBeDeleted = await SpotImage.findByPk(req.params.imageId , {
        include: { model: Spot }
    })

    if(!imageToBeDeleted) {
        return res.status(404).json({
            "message": "Spot Image couldn't be found"
          })
    }


    const imageJson = imageToBeDeleted.toJSON()
    
    if(imageJson.Spot.ownerId !== req.user.id) {
        return res.status(403).json({
            message: 'You do not have authorization to delete this image'
        })
    }

    await imageToBeDeleted.destroy()

   
    return res.status(200).json({
        "message": "Successfully deleted"
      })


    
})


//test router setup
router.get("/test", function (req, res) {
    res.send("endpoint hit");
  });

module.exports = router
