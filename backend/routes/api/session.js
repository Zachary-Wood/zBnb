const express = require('express')
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { User } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();


// backend/routes/api/session.js
const validateLogin = [
    check('credential')
      .exists({ checkFalsy: true })
      .notEmpty()
      .withMessage('Please provide a valid email or username.'),
    check('password')
      .exists({ checkFalsy: true })
      .withMessage('Please provide a password.'),
    handleValidationErrors
  ];

  const authenticate = (req, res, next) => {
    // Check if the user is authenticated
    if (req.isAuthenticated()) {
      return next(); // if the user is authentiated go to hte next middlewear
    }
  
    // If not authenticated throw a 401 error 
    res.status(401).json({ message: 'Unauthorized' });
  };
  
  

  router.post(
      '/',
      validateLogin,
      async (req, res, next) => {
        const { credential, password } = req.body;
    
        const user = await User.unscoped().findOne({
          where: {
            [Op.or]: {
              username: credential,
              email: credential
            }
          }
        });
    
        if (!user || !bcrypt.compareSync(password, user.hashedPassword.toString())) {
          const err = new Error('Login failed');
          err.status = 401;
          err.title = 'Login failed';
          err.errors = { credential: 'The provided credentials were invalid.' };
          return next(err);
        }
    
        const safeUser = {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          username: user.username,
        };
    
        await setTokenCookie(res, safeUser);
    
        return res.json({
          user: safeUser
        });
      }
    );
// Log in

  router.delete(
    '/',
    (_req, res) => {
      res.clearCookie('token');
      return res.json({ message: 'success' });
    }
  );


  router.get(
    '/',
    (req, res) => {
      const { user } = req;
      if (user) {
        const safeUser = {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          username: user.username,
        };
        return res.json({
          user: safeUser
        });
      } else return res.json({ user: null });
    }
  );

  
  
  
  
module.exports = router;