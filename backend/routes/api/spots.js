const express = require("express")
const { Op } = require('sequelize')
const { route } = require("./session")
const { requireAuth } = require("../../utils/auth")


const {
    Spot,
    
  } = require("../../db/models");


const router = express.Router()

router.get('/', async(req,res) => {
    let allspots = await Spot.findAll()
    res.status(200).json(allspots)
})







//get all current users spots
router.get('/current', requireAuth, async (req,res) => {
    const spots = await Spot.findAll({
        where: {
            ownerId: req.user.id
        }
    })
    res.json({spots})
})
    




module.exports = router