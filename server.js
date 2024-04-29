const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const mongoSanitize = require('express-mongo-sanitize') ;
const helmet = require('helmet') ;
const {xss} = require('express-xss-sanitizer') ;
const rateLimit = require('express-rate-limit') ;
const hpp = require('hpp') ;
const cors = require('cors') ;
const bodyParser = require('body-parser')
require('./models/Payment')
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
const authRoutes = require('./routes/auth');

//Load env vars
dotenv.config({ path: "./config/config.env" });

const stripe = require("stripe")("sk_test_51P6oXZHub7hok82f2kcmDah67GmCZC4ovavsgkWANdHtxVxD6hQNIYiKA2J4ljsJVsP86QEisF4tHiAIpFXQIYtF00ZxqAqjEI");
const endpointSecret = "whsec_1bc1e8c6cdb4ffb49d967af0ce7be7cb2b8f7601c0ec99304218a81ebf3a6b1e";
//Connect to database
connectDB();

const app = express();

app.use(express.json({
  limit: "25mb",
  verify: function(req, res, buf) {
    req.rawBody = buf;
  }
}));


//Body parser
app.use(express.urlencoded({limit : "25mb"})) ;

//Sanitize data
app.use(mongoSanitize()) ;

//Set security headers
app.use(helmet()) ;
//Prevent XSS attacks
app.use(xss()) ;
app.use('/api/v1/auth', authRoutes);


//Rate Limiting 
const limiter = rateLimit ({
  windowMs : 10*60*1000 , //10 mins
  max : 10000
}) ;
app.use(limiter) ;

//Prevent http param pollutions 
app.use(hpp()) ;

//const endpointSecret = "whsec_1bc1e8c6cdb4ffb49d967af0ce7be7cb2b8f7601c0ec99304218a81ebf3a6b1e";

//Enable CORS
app.use(cors()) ;


//Cookie parser
app.use(cookieParser());


//Route files
const hotels = require("./routes/hotels");
const auth = require("./routes/auth");
const reservations = require("./routes/reservations");
const reviews = require('./routes/reviews');
const rooms = require("./routes/rooms");
const payment = require("./routes/payments")

//Mount routers
app.use("/api/v1/hotels", hotels);
app.use("/api/v1/auth", auth);
app.use("/api/v1/reservations", reservations);
app.use("/api/v1/reviews", reviews);
app.use("/api/v1/rooms", rooms);
app.use("/api/v1/payment", payment);

const PORT = process.env.PORT || 5000;
const server = app.listen(
  PORT,
  console.log(
    "Server running in ",
    process.env.NODE_ENV,
    " mode on port ",
    PORT
  )
);

// Handle unhandle promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  //Close server & Exit process
  server.close(() => process.exit(1));
});

const swaggerOptions = {
  swaggerDefinition:{
    openapi: '3.0.0',
    info: {
      title: 'Library API',
      version: '1.0.0',
      description: 'A simple Express KodJeng API'
    },
    servers: [
      {
        url: 'http://localhost:5000/api/v1'
      }
    ]
  },
  apis:['./routes/*.js'],
}

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));