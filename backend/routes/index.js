// backend/routes/index.js
const express = require('express'); // we require express 
const router = express.Router();
const apiRouter = require('./api'); // we require our api 


router.use('/api', apiRouter); // we use our apiRouter and we provicde a oat 

router.get("/api/csrf/restore", (req, res) => {
    const csrfToken = req.csrfToken();
    res.cookie("XSRF-TOKEN", csrfToken);
    res.status(200).json({
      'XSRF-Token': csrfToken
    });
  });

module.exports = router; // exporting our router 
