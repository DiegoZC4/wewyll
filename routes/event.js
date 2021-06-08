const {v4: uuidv4} = require('uuid');

const express = require('express');

const router = express.Router();

const Event = require('../models/event');
const UserData = require('../models/user');
const Organization = require('../models/organization');

// router will be mounted on /event
router.get('/', async (req, res) => {
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
    res.json(data.map((event) => {
      // conform to API spec
      // TODO: don't barf random garbage out of the database if it's in there
      event.id = event._id;
      delete event._id;
      delete event.signUps;
      return event;
    }));
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

  const newEvent = new Event(req.body);
  newEvent._id = uuidv4();

  if (!userData.admin && newEvent.approved) {
    res.status(403).send('cannot set approved: true when not an admin');
    return;
  }

  newEvent.save((error, doc) => {
    if (error) {
      // todo better validation
      res.status(500).send("internal server error");
      return;
    }
    // conform to API spec
    doc.id = doc._id;
    delete doc._id;
    delete doc.signUps;
    return res.status(201).json(doc);
  });
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
