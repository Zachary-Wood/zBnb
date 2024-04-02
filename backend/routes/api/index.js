// backend/routes/api/index.js
const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const { restoreUser } = require("../../utils/auth.js");
const spotsRouter = require('./spots.js')
const reviewRouter = require('./reviews.js')
const bookingsRouter = require('./bookings.js')
const spotImagesRouter = require('./spot-images.js')
const reviewImagesRouter = require("./review-images.js");




// Connect restoreUser middleware to the API router n
  // If current user session is valid, set req.user to the user in the database
  // If current user session is not valid, set req.user to null
router.use(restoreUser);
router.use('/session', sessionRouter);
router.use('/users', usersRouter);
router.use('/spots', spotsRouter)
router.use('/reviews', reviewRouter)
router.use('/bookings', bookingsRouter)
router.use('/spot-images', spotImagesRouter)
router.use('/review-images', reviewImagesRouter)

router.post('/test', (req, res) => {
  res.json({ requestBody: req.body });
});

module.exports = router;