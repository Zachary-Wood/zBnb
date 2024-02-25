const router = require('express').Router();

const authenticate = (req, res, next) => {
    // Check if the user is authenticated
    if (req.isAuthenticated()) {
      return next(); // if the user is authentiated go to hte next middlewear
    }
  
    // If not authenticated throw a 401 error 
    res.status(401).json({
        "message": "Authentication required"
      });
  };
  

  module.exports = authenticate