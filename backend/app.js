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


  app.use((_req, _res, next) => {
    const err = new Error("The requested resource couldn't be found."); // if theres an err we say the resouce cant be found 
    err.title = "Resource Not Found"; // the title is not found
    err.errors = { message: "The requested resource couldn't be found." }; // we give the user a mesagage 
    err.status = 404; // we set the staus to be 404 which is not found 
    next(err); // pass the err to the next function to be caught 
  });


  const { ValidationError } = require('sequelize');

// ...

// Process sequelize errors
app.use((err, _req, _res, next) => {
  // check if error is a Sequelize error:
  if (err instanceof ValidationError) { // we check if the err is apart of the ValidationError 
    let errors = {}; // we create an errors obj 
    for (let error of err.errors) {  // we iterate through our errors object 
      errors[error.path] = error.message;
    }
    err.title = 'Validation error'; // the title is 'Validation year'
    err.errors = errors;
  }
  next(err);
});


app.use((err, _req, res, _next) => {
  res.status(err.status || 500); /// we set the status to what is or 500
  console.error(err); // print the err
  res.json({ // we send a json response to the user with all the data and messages inside 
    title: err.title || 'Server Error',
    message: err.message,
    errors: err.errors,
    stack: isProduction ? null : err.stack
  });
});
  

  module.exports = app;