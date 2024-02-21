const express = require('express'); 
require('express-async-errors');
const morgan = require('morgan');
const cors = require('cors');
const csurf = require('csurf');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const routes = require('./routes')

const { environment } = require('./config');
const isProduction = environment === 'production';

const app = express()


app.use(morgan('dev')); // we want to use the morgan middlewear 
app.use(cookieParser()); // we want the app to use cookieParser middlewear
app.use(express.json()); // we want our express application to send things as json


// Security Middleware
if (!isProduction) { // if the app is not in production use cors
    // enable cors only in development
    app.use(cors());
  }
  
  // helmet helps set a variety of headers to better secure your app
  app.use(
    helmet.crossOriginResourcePolicy({  
      policy: "cross-origin"
    })
  );
  
  // Set the _csrf token and create req.csrfToken method
  app.use(
    csurf({ // we set up csurf so we are not vulernable to attacks 
      cookie: {
        secure: isProduction,
        sameSite: isProduction && "Lax", // has to be in production and 'Lax'
        httpOnly: true // http can only read it 
      }
    })
  );

  app.use(routes) // we use our routes folder
  

  module.exports = app;