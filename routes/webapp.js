const express = require('express');
const axios = require('axios');
const {auth} = require('express-openid-connect');

const router = express.Router();

router.use(auth({
  authRequired: false,
  auth0Logout: true,
  baseURL: process.env.BASE_URL,
  clientID: process.env.CLIENT_ID,
  issuerBaseURL: process.env.ISSUER_BASE_URL,
  secret: process.env.SECRET,
  clientSecret: process.env.SECRET,
  authorizationParams: {
    response_type: 'code',
    audience: 'wewyll-api',
  }
}));
const PORT = process.env.PORT || 5000;

router.get('/', async (req, res) => {
  if (req.oidc.isAuthenticated()) {
    let { token_type, access_token } = req.oidc.accessToken;
    let apiClient = axios.create({
      headers: {Authorization: `${token_type} ${access_token}`},
      baseURL: `${process.env.BASE_URL}:${PORT}/api`
    })

    // user
    let userResponse = await apiClient.get(`/user/${req.oidc.user.sub}`)
    let user = userResponse.data;

    let events = (await apiClient.get('/event')).data;
    let organizations = (await apiClient.get('/organization')).data;
    let users
    if (user.admin) {
      users = (await apiClient.get('/user')).data;
    }

    events.forEach(event => {
      event.orgName = organizations.find(org => org._id === event.organization).name;
    })

    res.render('home', {
      login: true,
      user: {
        id: user._id,
        volunteer: user.volunteer,
        admin: user.admin || false,
        authString: `${token_type} ${access_token}`
      },
      events: events,
      organizations: organizations,
      users: users
    })
    // res.send(`Logged in, API authorization ${token_type} ${access_token}`)
  } else {
    res.render('home', {login: false});
  }
});

module.exports = router;
