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
      .withMessage('Email or username is required'),
    check('password')
      .exists({ checkFalsy: true })
      .withMessage('Password is required'),
    handleValidationErrors
  ];
  


// Log in
  router.post('/', validateLogin, async (req, res, next) => {
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
          err.errors = { credential: 'Invaled Credentials' };
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




//logout
  router.delete(
    '/',
    (_req, res) => {
      res.clearCookie('token');
      return res.json({ message: 'success' });
    }
  );


// restore user session
  router.get('/',(req, res) => {
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

  router.get('/users/:id', async(req, res) => {
    const id = req.params.id
    const user = await User.findByPk(id,
      {
        attributes: ['id','firstName', 'lastName', 'email', 'username']
      })

    if(!id) {
      res.status(200).json({"user": null})
    }



    res.status(200).json({user})

  })

module.exports = router;