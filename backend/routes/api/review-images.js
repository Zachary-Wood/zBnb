const express = require('express')
const { Op } = require("sequelize")
const {requireAuth} = require('../../utils/auth')
const { Spot, SpotImage, User, Review, ReviewImage, Booking } = require('../../db/models');
const router = express.Router()

// DELETE A REVIEW IMAGE
router.delete('/:imageId', requireAuth, async (req, res) => {
    
    const imageToBeDeleted = await ReviewImage.findByPk(req.params.imageId , {
        include: { model: Review }
    })

    if(!imageToBeDeleted) {
        return res.status(404).json({
            "message": "Review Image couldn't be found"
          })
    }

    const imageJson = imageToBeDeleted.toJSON()
    
    if(imageJson.Review.userId !== req.user.id) {
        return res.status(403).json({
            message: 'You do not have authorization to delete this image'
        })
    }

    await imageToBeDeleted.destroy()

    return res.status(200).json({
        "message": "Successfully deleted"
      })


    
})





module.exports = router;
