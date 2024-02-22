const jwt = require('jsonwebtoken');
const { jwtConfig } = require('../config'); // require all the JWT packages 
const { User } = require('../db/models'); // we require the User model 

const { secret, expiresIn } = jwtConfig; // extract the secret and the expires in fromjwtConfig


const setTokenCookie = (res, user) => {
    // Create the token.
    const safeUser = { // payload
      id: user.id,
      email: user.email,
      username: user.username,
    };
    const token = jwt.sign( // this is our token that 
      { data: safeUser },
      secret,
      { expiresIn: parseInt(expiresIn) } // 604,800 seconds = 1 week
    );
  
    const isProduction = process.env.NODE_ENV === "production"; // check if were in the production branch
  
    // Set the token cookie
    res.cookie('token', token, { // set the cookie the user which will succfully log them in 
      maxAge: expiresIn * 1000, // maxAge in milliseconds
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction && "Lax"
    });
  
    return token;
  };

  const restoreUser = (req, res, next) => {
    // token parsed from cookies
    const { token } = req.cookies;
    req.user = null;
  
    return jwt.verify(token, secret, null, async (err, jwtPayload) => { // see if there in our database
      if (err) {
        return next(); // pass it down 
      }
  
      try {
        const { id } = jwtPayload.data;
        req.user = await User.findByPk(id, { // we find the user by id in our database
          attributes: {
            include: ['email', 'createdAt', 'updatedAt']
          }
        });
      } catch (e) { // if there is an error we clear the cookie that would be sent to them 
        res.clearCookie('token');
        return next();
      }
  
      if (!req.user) res.clearCookie('token'); // another security measure 
  
      return next();
    });
  };


  // If there is no current user, return an error
const requireAuth = function (req, _res, next) {
    if (req.user) return next();
  
    const err = new Error('Authentication required');
    err.title = 'Authentication required';
    err.errors = { message: 'Authentication required' };
    err.status = 401;
    return next(err);
  }



module.exports = { setTokenCookie, restoreUser, requireAuth };