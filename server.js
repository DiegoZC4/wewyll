// Import npm packages
require('dotenv').config()

const express = require('express');
const mongoose = require('mongoose');
const winston = require('winston');
const expressWinston = require('express-winston');
const logger = require('./logging');
const path = require('path');
const jwks = require('jwks-rsa');
const passport = require('passport');
const passportJwt = require('passport-jwt');
const AnonymousStrategy = require('passport-anonymous').Strategy;
const chalk = require('chalk');

const app = express();

const PORT = process.env.PORT || 5000; // Step 1

const event = require('./routes/event');
const nonprofit = require('./routes/nonprofit');
const volunteer = require('./routes/volunteer');
const commonField = require('./routes/commonField');
const user = require('./routes/user');
const webapp = require('./routes/webapp');

const UserData = require('./models/user');

logger.info("Initializing WeWyll API Server");

// Step 2
mongoose.connect(process.env.MONGODB_URI ||
    "mongodb+srv://Shane:TMCP2ujjjzmQ6iof@wewyll.oeoce.mongodb.net/WeWyll?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });

mongoose.connection.on('connected', () => {
  logger.info("Mongoose is connected");
});

// app.set('view engine', 'pug')

// Data parsing
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// Step 3
// HTTP request logger
app.use(expressWinston.logger({
  winstonInstance: logger,
  expressFormat: true,
  colorize: true,
  statusLevels: true
}));

app.use((req, res, next) => {
  logger.info(chalk.gray(`${req.method} ${req.path}`));
  next();
})

const apiRouter = express.Router();

apiRouter.use('/event', event);
apiRouter.use('/nonprofit', nonprofit);
apiRouter.use('/volunteer', volunteer);
apiRouter.use('/commonfield', commonField);
apiRouter.use('/user', user);

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
      UserData.findById(jwtPayload.sub).exec(async (err, user) => {
        if (err) {
          return done(err)
        }
        if (user) {
          return done(null, user);
        } else {
          let newUser = new UserData({
            _id: jwtPayload.sub,
            volunteer: '',
            nonprofit: '',
            nonprofitApproved: false,
            business: '',
            businessApproved: false,
            admin: false,
          });
          newUser = await newUser.save();
          return done(null, newUser);
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
// app.use('/', webapp);

logger.info(`Server starting at port ${PORT}`);
app.listen(PORT);
