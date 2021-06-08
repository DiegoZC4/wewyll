// Import npm packages
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const path = require('path');
const jwt = require('express-jwt');
const jwks = require('jwks-rsa');

const app = express();

const PORT = process.env.PORT || 5000; // Step 1

const event = require('./routes/event');
const organization = require('./routes/organization');
const volunteer = require('./routes/volunteer');
const commonField = require('./routes/commonField');


// Step 2
mongoose.connect(process.env.MONGODB_URI ||
    "mongodb+srv://Shane:TMCP2ujjjzmQ6iof@wewyll.oeoce.mongodb.net/WeWyll?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });

mongoose.connection.on('connected', () => {
  console.log('Mongoose is connected!!!!');
});

// Data parsing
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// authentication
let jwtCheck = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: 'https://wewyll.us.auth0.com/.well-known/jwks.json'
  }),
  audience: 'wewyll-api',
  issuer: 'https://wewyll.us.auth0.com/',
  algorithms: ['RS256']
});
app.use(jwtCheck);

// Step 3
// HTTP request logger
app.use(morgan('tiny'));

app.use('/event', event);
app.use('/organization', organization);
app.use('/volunteer', volunteer);
app.use('/commonfield', commonField);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

console.log(`Server is starting at ${PORT}`)
app.listen(PORT);
