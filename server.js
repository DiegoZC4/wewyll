// Import npm packages
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const path = require('path');
const jwt = require('express-jwt');
const jwks = require('jwks-rsa');
const passport = require('passport');
const passportJwt = require('passport-jwt');
const AnonymousStrategy = require('passport-anonymous').Strategy;

const app = express();

const PORT = process.env.PORT || 5000; // Step 1

const event = require('./routes/event');
const organization = require('./routes/organization');
const volunteer = require('./routes/volunteer');
const commonField = require('./routes/commonField');

const UserData = require('./models/user');

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

// Step 3
// HTTP request logger
app.use(morgan('tiny'));

const apiRouter = express.Router();

apiRouter.use('/event', event);
apiRouter.use('/organization', organization);
apiRouter.use('/volunteer', volunteer);
apiRouter.use('/commonfield', commonField);

let opts = {
  secretOrKeyProvider: jwks.passportJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: 'https://wewyll.us.auth0.com/.well-known/jwks.json'
  }),
  jwtFromRequest: passportJwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
  issuer: 'https://wewyll.us.auth0.com/',
  audience: 'wewyll-api',
  algorithms: ['RS256']
};

passport.use('jwt', new passportJwt.Strategy(opts, (jwtPayload, done) => {
      UserData.findById(jwtPayload.sub).exec((err, user) => {
        if (err) {
          return done(err)
        }
        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      })
    }
));
passport.use('anon', new AnonymousStrategy());

app.use(passport.initialize());

app.use('/api', apiRouter);


if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

console.log(`Server is starting at ${PORT}`)
app.listen(PORT);
