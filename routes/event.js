const {v4: uuidv4} = require('uuid');

const express = require('express');

const router = express.Router();

const Event = require('../models/event');
const UserData = require('../models/user');
const Organization = require('../models/organization');

// TODO logging

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

router.get('/:eventId', async (req, res) => {
  let eventId = req.params.eventId;
  let userId = req.user.sub;
  let userData = await UserData.findById(userId).exec();

  let event = await Event.findById(eventId).exec();
  if (!event || (!event.approved
      && userData.organization !== event.organization
      && !userData.admin)) {
    // if the event does not exist, we return a 404
    // but we ALSO do a 404 if it's not approved yet and we aren't either
    // 1) its organization or 2) an admin
    res.sendStatus(404);
  } else {
    event.id = event._id;
    delete event._id; // conform to api spec
    delete event.signUps; // these are exposed by the /:eventId/signups/ endpoint
    res.json(event);
  }
});

router.patch('/:eventId', async (req, res) => {
  let eventId = req.params.eventId;
  let userId = req.user.sub;
  let userData = await UserData.findById(userId).exec();
  const body = req.body;

  let event = await Event.findById(eventId).exec();

  /*
  the specific interaction of authentication levels with response codes here
  is a bit weird

  * basically, if the event should NOT be visible to the currently auth'd user,
    (i.e. GET /:eventId would reply 404), we reply 404 to avoid enumeration
  * if the event SHOULD be visible to the current user, but they don't have
    permission to edit it (i.e. a volunteer user attempting to edit an
    already-approved event) then reply 403 ("you can see but you can't touch")
  * if the request is borked, reply 400
  */
  if (!event) {
    // it just doesn't exist
    res.sendStatus(404);
  } else if (userData.organization !== event.organization && !userData.admin) {
    if (event.approved) {
      // we can see the event but can't edit
      res.sendStatus(403);
    } else {
      // event exists but we can't see it
      res.sendStatus(404);
    }
  } else {
    // we can edit

    if (body.organization) {
      if (await Organization.findById(body.organization).exec()) {
        event.organization = body.organization;
      } else {
        res.status(400).send("organization does not exist"); // not allowed to edit ID
        return;
      }
    }

    if (body.approved !== event.approved) {
      if (userData.admin) {
        // TODO: allow organizations to revoke approval?
        // TODO: should approval be revoked on any edit?
        event.approved = body.approved;
      } else {
        res.status(403).send("cannot edit approval status");
      }
    }

    // TODO better validation for commonfields/customfields

    // no event ID change allowed
    delete body._id;

    Object.assign(event, body);

    event.save((err, doc) => {
      if (error) {
        // todo better validation
        res.status(500).send("internal server error");
        return;
      }
      // conform to API spec
      doc.id = doc._id;
      delete doc._id;
      delete doc.signUps;
      return res.status(200).json(doc);
    });
  }
});

router.delete('/:eventId', async (req, res) => {
  let eventId = req.params.eventId;
  let userId = req.user.sub;
  let userData = await UserData.findById(userId).exec();

  let event = await Event.findById(eventId).exec();

  if (!event) {
    // it just doesn't exist
    res.sendStatus(404);
  } else if (userData.organization !== event.organization && !userData.admin) {
    if (event.approved) {
      // we can see the event but can't delete
      res.sendStatus(403);
    } else {
      // event exists but we can't see it
      res.sendStatus(404);
    }
  } else {
    // we can delete
    Event.deleteOne({_id: eventId}).exec((err => {
      if (err) {
        // todo better error
        res.sendStatus(500);
      } else {
        res.sendStatus(200);
      }
    }));
  }
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
