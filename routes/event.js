// noinspection JSUnresolvedVariable

const {v4: uuidv4} = require('uuid');

const express = require('express');
const passport = require('passport');

const {checkSchema, validationResult} = require('express-validator');

const router = express.Router();

const Event = require('../models/event');
const UserData = require('../models/user');
const Organization = require('../models/organization');
const CommonField = require('../models/commonField');

// TODO logging

// router will be mounted on /event
router.get('/',
    passport.authenticate(['jwt', 'anon'], {session: false}),
    async (req, res) => {
      // TODO somehow fail harder if provided an invalid JWT (as opposed to no JWT)
      const user = req.user;

      const query = Event.find();

      // TODO more params
      if (req.query.org) {
        query.where('organization').equals(req.query.org);
      }

      if (!(user && user.admin)) {
        query.where('approved').equals(true);
      }

      // TODO pagination
      query.then((data) => {
        res.json(data.map((event) => {
          // conform to API spec
          // TODO: don't barf random garbage out of the database if it's in there
          delete event.signUps;
          return event;
        }));
      })
      .catch((error) => {
        console.log('error on GET events: ', error);
      });
    });

router.post('/',
    passport.authenticate('jwt', {session: false}),
    async (req, res) => {
      const user = req.user;
      const body = req.body;

      let org;
      if (body.organization) {
        org = await Organization.findById(body.organization).exec();
      }

      let authOk = false;
      if (user.admin) {
        authOk = true;
      } else if (user.organization) {
        // do you exist
        if (org && body && user.organization === body.organization) {
          authOk = true;
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

      if (!user.admin && newEvent.approved) {
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
        delete doc.signUps;
        return res.status(201).json(doc);
      });
    });

router.get('/:eventId',
    passport.authenticate(['jwt', 'anon'], {session: false}),
    async (req, res) => {
      let eventId = req.params.eventId;
      const user = req.user;

      let event = await Event.findById(eventId).exec();
      if (!event ||
          (!event.approved && !(user &&
              (user.organization === event.organization || user.admin)))) {
        // if the event does not exist, we return a 404
        // but we ALSO do a 404 if it's not approved yet and we aren't either
        // 1) its organization or 2) an admin
        res.sendStatus(404);
      } else {
        delete event.signUps; // these are exposed by the /:eventId/signups/ endpoint
        res.json(event);
      }
    });

router.patch('/:eventId',
    passport.authenticate(['jwt'], {session: false}),
    async (req, res) => {
      let eventId = req.params.eventId;
      const user = req.user;
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
      } else if (user.organization !== event.organization && !user.admin) {
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
          if (user.admin) {
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
          if (err) {
            // todo better validation
            res.status(500).send("internal server error");
            return;
          }

          delete doc.signUps;
          return res.status(200).json(doc);
        });
      }
    });

router.delete('/:eventId',
    passport.authenticate(['jwt'], {session: false}),
    async (req, res) => {
      let eventId = req.params.eventId;
      const user = req.user;

      let event = await Event.findById(eventId).exec();

      if (!event) {
        // it just doesn't exist
        res.sendStatus(404);
      } else if (user.organization !== event.organization && !user.admin) {
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

// TODO make code less duplicated
router.get('/:eventId/signup',
    passport.authenticate(['jwt'], {session: false}),
    async (req, res) => {
      let eventId = req.params.eventId;
      const user = req.user;

      let event = await Event.findById(eventId).exec();

      if (!event) {
        // it just doesn't exist
        res.sendStatus(404);
      } else if (user.organization !== event.organization && !user.admin) {
        if (event.approved) {
          // we can see the event but not signups
          res.sendStatus(403);
        } else {
          // event exists but we can't see it
          res.sendStatus(404);
        }
      } else {
        // view signups
        res.status(200).json(event.signUps);
      }
    });

router.post('/:eventId/signup',
    passport.authenticate(['jwt', 'anon'], {session: false}),
    async (req, res) => {
      let eventId = req.params.eventId;
      const user = req.user;
      const body = req.body;
      let event = await Event.findById(eventId).exec();

      if (!event || (!event.approved && !(user &&
          (user.organization === event.organization || user.admin)))) {
        // doesn't exist, or we can't see it
        res.sendStatus(404);
      } else {
        // process

        // populate necessary fields
        let fields = await CommonField.find().where('_id').in(
            event.commonFields).exec();

        fields.concat(event.customFields);

        let missingRequired = [];
        const fieldData = body.fieldData;

        if (fields.filter(field => field.required).length > 0 && !fieldData) {
          res.status(400).send("missing fieldData in body");
          return;
        }

        fields.forEach(field => {
          if (field.required && !fieldData.some(
              data => data._id === field._id)) {
            missingRequired.push(field._id);
          }
        });

        if (missingRequired.length > 0) {
          res.status(400).send("missing required fields: " + missingRequired);
          return;
        }

        let signUp = {
          _id: uuidv4(),
          timestamp: Date.now(),
          // TODO option to allow/disallow anonymous signups?
          user: user.volunteer,
          fieldData: fieldData,
        };

        event.signUps.push(signUp);

        event.save((err, doc) => {
          if (err) {
            // todo better validation
            res.sendStatus(500);
            return;
          }
          return res.status(200).json(
              doc.signUps.find(s => s._id === signUp._id));
        });
      }
    });

router.get('/:eventId/signup/:signUpId',
    passport.authenticate(['jwt'], {session: false}),
    async (req, res) => {
      let eventId = req.params.eventId;
      let signUpId = req.params.signUpId;
      const user = req.user;
      let event = await Event.findById(eventId).exec();

      if (!event) {
        // doesn't exist
        res.sendStatus(404);
        return;
      }

      let hasViewAuth = user &&
          (user.admin || user.organization === event.organization);

      if (event.approved || hasViewAuth) {
        let signUp = event.signUps.find(s => s._id === signUpId);

        if (signUp &&
            (hasViewAuth ||
                (signUp.user && signUp.user === user.volunteer))) {
          res.json(signUp);
        } else {
          // doesn't exist, or we don't have view authorization
          res.sendStatus(404);
        }
      } else {
        // event doesn't exist or we don't have view authorization
        res.sendStatus(404);
      }
    });

router.delete('/:eventId/signup/:signUpId',
    passport.authenticate(['jwt'], {session: false}),
    async (req, res) => {
      let eventId = req.params.eventId;
      let signUpId = req.params.signUpId;
      let user = req.user;
      let event = await Event.findById(eventId).exec();

      if (!event) {
        // doesn't exist
        res.sendStatus(404);
        return;
      }

      let hasViewAuth = user.admin || user.organization === event.organization;

      // if you can view a sign-up, you can delete it
      if (event.approved || hasViewAuth) {
        let signUp = event.signUps.find(s => s._id === signUpId);

        if (signUp &&
            (hasViewAuth || (signUp.user && signUp.user === user.volunteer))) {
          Event.findByIdAndUpdate(eventId,
              {$pull: {'signUps': {_id: signUpId}}}).exec((err) => {
            if (err) {
              // todo better validation
              res.sendStatus(500);
            } else {
              res.sendStatus(200);
            }
          });
        } else {
          // doesn't exist, or we don't have view authorization
          res.sendStatus(404);
        }
      } else {
        // event doesn't exist or we don't have view authorization
        res.sendStatus(404);
      }
    });

module.exports = router;
