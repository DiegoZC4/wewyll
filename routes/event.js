const { v4: uuidv4 } = require('uuid');

const express = require('express');

const router = express.Router();


const Event = require('../models/event');
const UserData = require('../models/user');
const Organization = require('../models/organization');

// router will be mounted on /event
router.get('/', async(req, res) => {
  let userId = req.user.sub;
  let userData = await UserData.findById(userId).exec();

  const query = Event.find();

  // TODO more params
  if (req.query.org) {
    query.where('organization').equals(req.query.org);
  }

  if (!(userData && userData.admin)) {
    query.where('approved').equals(true);
  }

  // TODO pagination
  query.then((data) => {
    res.json(data);
  })
  .catch((error) => {
    console.log('error on GET events: ', error);
  });
});

router.post('/', async (req, res) => {
  let userId = req.user.sub;
  let userData = await UserData.findById(userId).exec();
  const body = req.body;

  let org;
  if (body.organization) {
    org = await Organization.findById(body.organization).exec();
  }

  let authOk = false;
  if (userData) {
    if (userData.admin) {
      authOk = true;
    } else if (userData.organization) {
      // do you exist
      if (org && body && userData.organization === body.organization) {
        authOk = true;
      }
    }
  }
  if (!authOk) {
    res.sendStatus(403);
    return;
  }

  if (!body) {
    res.status(400).send('Missing request body');
    return;
  }

  // validate
  if (!body.title) {
    res.status(400).send('Missing parameter: title');
    return;
  }

  if (!body.organization) {
    res.status(400).send('Missing parameter: organization');
    return;
  }

  if (!org) {
    res.status(400).send("organization does not exist");
    return;
  }

  // TODO: don't let orgs set approved to true

  const newEvent = new Event(req.body);
  newEvent._id = uuidv4();
  newEvent.save((error, doc) => {
    if (error) {
      // todo better validation
      res.status(500).send("internal server error");
      return;
    }
    return res.json(doc);
  })
});

router.get('/:eventId', (req, res) => {
  let eventId = req.params.eventId;
  // TODO not implemented
});

router.patch('/:eventId', (req, res) => {
  let eventId = req.params.eventId;
  // TODO not implemented
});

router.delete('/:eventId', (req, res) => {
  let eventId = req.params.eventId;
  // TODO not implemented
});

router.get('/:eventId/signup', (req, res) => {
  let eventId = req.params.eventId;
  // TODO not implemented
});

router.post('/:eventId/signup', (req, res) => {
  let eventId = req.params.eventId;
  // TODO not implemented
});

router.get('/:eventId/signup/:signUpId', (req, res) => {
  let eventId = req.params.eventId;
  let signUpId = req.params.signUpId;
  // TODO not implemented
});

router.delete('/:eventId/signup/:signUpId', (req, res) => {
  let eventId = req.params.eventId;
  let signUpId = req.params.signUpId;
  // TODO not implemented
});

module.exports = router;
