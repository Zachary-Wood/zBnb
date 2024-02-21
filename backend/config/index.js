module.exports = {
    environment: process.env.NODE_ENV || 'development', // this is our enviorment varaible 
    port: process.env.PORT || 8000, // this is the varible that defines our port 
    dbFile: process.env.DB_FILE, // this is our variable for our database
    jwtConfig: {
      secret: process.env.JWT_SECRET, // we set a secret config variable
      expiresIn: process.env.JWT_EXPIRES_IN // how long it takes until it expires 
    }
  };
  