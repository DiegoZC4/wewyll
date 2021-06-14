// noinspection JSUnresolvedVariable

const {v4: uuidv4} = require('uuid');

const express = require('express');
const passport = require('passport');

const router = express.Router();

const logger = require('../logging');
const Event = require('../models/event');
const Organization = require('../models/organization');
const CommonField = require('../models/commonfield');

// TODO logging

// router will be mounted on /event
router.get('/',
    passport.authenticate(['jwt', 'anon'], {session: false}),
    async (req, res) => {
      // TODO somehow fail harder if provided an invalid JWT (as opposed to no JWT)
      const user = req.user;

      logger.debug(`user: ${user}`);

      const query = Event.find();

      // TODO more params
      if (req.query.org) {
        logger.debug(`searching for events with org ${req.query.org}`);
        query.where('organization').equals(req.query.org);
      }

      if (!(user && user.admin)) {
        logger.debug(`user does not have access to unapproved events`);
        query.where('approved').equals(true);
      }

      // TODO pagination
      query.then((data) => {
        logger.debug(`returning ${data.length} matching events`);
        res.json(data.map((event) => {
          // conform to API spec
          // TODO: don't barf random garbage out of the database if it's in there
          delete event.signUps;
          return event;
        }));
      })
      .catch((error) => {
        logger.error(`database error on events query: ${error}`);
      });
    });

router.post('/',
    passport.authenticate('jwt', {session: false}),
    async (req, res) => {
      const user = req.user;
      const body = req.body;
      logger.debug(`user: ${user}`);
      logger.debug(`request body: ${body}`);

      let org;
      if (body.organization) {
        org = await Organization.findById(body.organization).exec();
      }

      let authOk = false;
      if (user.admin) {
        logger.debug(`user is admin`);
        authOk = true;
      } else if (user.organization) {
        // do you exist
        if (org && body && user.organization === body.organization) {
          logger.debug(`user organization matches organization in body`);
          authOk = true;
        } else {
          logger.debug(
              `user organization mismatched with body or does not exist`);
        }
      }

      if (!authOk) {
        res.sendStatus(403);
        return;
      }

      if (!body) {
        logger.warn(`request body does not exist`);
        res.status(400).send('Missing request body');
        return;
      }

      // validate
      if (!body.title) {
        logger.warn(`request body missing parameter: title`);
        res.status(400).send('Missing parameter: title');
        return;
      }

      if (!body.organization) {
        logger.warn(`request body missing parameter: organization`);
        res.status(400).send('Missing parameter: organization');
        return;
      }

      if (!org) {
        logger.warn(`organization ${body.organization} does not exist`);
        res.status(400).send("organization does not exist");
        return;
      }

      const newEvent = new Event(req.body);
      newEvent._id = uuidv4();

      if (!user.admin && newEvent.approved) {
        logger.warn(
            `trying to submit approved event without admin permissions`);
        res.status(403).send('cannot set approved: true when not an admin');
        return;
      }

      newEvent.save((error, doc) => {
        if (error) {
          // todo better validation
          logger.error(`database error on saving new event: ${error}`);
          res.status(500).send("internal server error");
          return;
        }

        logger.info(`created new event ${doc._id}`);
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
      logger.debug(`user: ${user}`);

      let event = await Event.findById(eventId).exec();
      // if the event does not exist, we return a 404
      // but we ALSO do a 404 if it's not approved yet and we aren't either
      // 1) its organization or 2) an admin
      if (!event) {
        logger.warn(`event ${eventId} does not exist`);
        res.sendStatus(404);
      } else if (!event.approved && !(user &&
          (user.organization === event.organization || user.admin))) {
        logger.warn(`event ${eventId} exists but has not been approved yet`);
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
      logger.debug(`user: ${user}`);
      logger.debug(`request body: ${body}`);

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
        logger.warn(`event ${eventId} does not exist`);
        // it just doesn't exist
        res.sendStatus(404);
      } else if (user.organization !== event.organization && !user.admin) {
        logger.warn(`user does not have edit permissions for this event`);
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
          if (user.admin) {
            if (await Organization.findById(body.organization).exec()) {
              event.organization = body.organization;
            } else {
              logger.warn(`new organization ${body.organization} not found`);
              res.status(400).send("organization does not exist"); // not allowed to edit ID
              return;
            }
          } else {
            logger.warn(`user is not an admin but is trying to change org ID`);
            res.status(403).send("cannot change organization ID");
          }
        }

        if (body.approved !== event.approved) {
          if (user.admin) {
            // TODO: allow organizations to revoke approval?
            // TODO: should approval be revoked on any edit?
            event.approved = body.approved;
          } else {
            logger.warn(
                `user is not an admin but is trying to change approval status`);
            res.status(403).send("cannot edit approval status");
          }
        }

        // TODO better validation for commonfields/customfields

        if (body._id && body._id !== event._id) {
          logger.warn(`user is trying to change event ID`);
        }
        // no event ID change allowed
        delete body._id;

        Object.assign(event, body);

        event.save((err, doc) => {
          if (err) {
            // todo better validation
            logger.error(`database error on saving edited event: ${error}`);
            res.status(500).send("internal server error");
            return;
          }

          logger.debug(`successfully edited event ${doc._id}`);
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
      logger.debug(`user: ${user}`);

      let event = await Event.findById(eventId).exec();

      if (!event) {
        logger.warn(`event ${eventId} does not exist`);
        // it just doesn't exist
        res.sendStatus(404);
      } else if (user.organization !== event.organization && !user.admin) {
        logger.warn(`user does not have delete permissions for this event`);
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
            logger.error(`database error on deleting event: ${error}`);
            // todo better error
            res.sendStatus(500);
          } else {
            logger.info(`deleted event ${eventId}`);
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
      logger.debug(`user: ${user}`);

      let event = await Event.findById(eventId).exec();

      if (!event) {
        // it just doesn't exist
        logger.warn(`event ${eventId} does not exist`);
        res.sendStatus(404);
      } else if (user.organization !== event.organization && !user.admin) {
        logger.warn(`user is not authorized to view signups for this event`);
        if (event.approved) {
          // we can see the event but not signups
          res.sendStatus(403);
        } else {
          // event exists but we can't see it
          res.sendStatus(404);
        }
      } else {
        // view signups
        logger.debug(`returning ${event.signUps.length} signups`);
        res.status(200).json(event.signUps);
      }
    });

router.post('/:eventId/signup',
    passport.authenticate(['jwt', 'anon'], {session: false}),
    async (req, res) => {
      let eventId = req.params.eventId;
      const user = req.user;
      const body = req.body;

      logger.debug(`user: ${user}`);
      logger.debug(`request body: ${body}`);

      let event = await Event.findById(eventId).exec();

      if (!event) {
        // doesn't exist
        logger.warn(`event ${eventId} does not exist`);
        res.sendStatus(404);
      } else if (!event.approved && !(user &&
          (user.organization === event.organization || user.admin))) {
        logger.warn(`event ${eventId} exists but has not been approved yet`);
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
          logger.warn(
              `a nonzero number of fields are required but no field data was provided`);
          res.status(400).send("missing fieldData in body");
          return;
        }


        // FIXME signups can be added that don't have _id parameters in their
        //  field data
        fields.forEach(field => {
          if (field.required && !fieldData.some(
              data => data._id === field._id)) {
            missingRequired.push(field._id);
          }
        });

        if (missingRequired.length > 0) {
          logger.warn(`required fields are missing: ${missingRequired}`);
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

        // TODO: make operation atomic?
        event.signUps.push(signUp);

        event.save((err, doc) => {
          if (err) {
            logger.error(`database error on saving new sign-up: ${error}`);
            res.sendStatus(500);
            return;
          }
          logger.info(`saved new sign-up: ${signUp._id}`);
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

      logger.debug(`user: ${user}`);

      let event = await Event.findById(eventId).exec();

      if (!event) {
        logger.warn(`event ${eventId} does not exist`);
        // doesn't exist
        res.sendStatus(404);
        return;
      }

      let hasViewAuth = user &&
          (user.admin || user.organization === event.organization);

      if (event.approved || hasViewAuth) {
        let signUp = event.signUps.find(s => s._id === signUpId);

        if (signUp) {
          if (hasViewAuth || (signUp.user && signUp.user === user.volunteer)) {
            res.json(signUp);
          } else {
            // we don't have view authorization
            if (signUp.user) {
              logger.warn(
                  `user with volunteer id ${user.volunteer} does not have authorization to view this sign-up (volunteer ${signUp.user})`);
            } else {
              logger.warn(
                  `user does not have authorization to view anonymous sign-ups`);
            }
            res.sendStatus(404);
          }
        } else {
          // doesn't exist
          logger.warn(`sign-up ${signUpId} does not exist in event ${eventId}`);
          res.sendStatus(404);
        }
      } else {
        // event doesn't exist or we don't have view authorization
        logger.warn(`event ${eventId} exists but has not been approved yet`);
        res.sendStatus(404);
      }
    });

router.delete('/:eventId/signup/:signUpId',
    passport.authenticate(['jwt'], {session: false}),
    async (req, res) => {
      let eventId = req.params.eventId;
      let signUpId = req.params.signUpId;
      let user = req.user;
      logger.debug(`user: ${user}`);

      let event = await Event.findById(eventId).exec();

      if (!event) {
        // doesn't exist
        logger.warn(`event ${eventId} does not exist`);
        res.sendStatus(404);
        return;
      }

      let hasViewAuth = user.admin || user.organization === event.organization;

      // if you can view a sign-up, you can delete it
      if (event.approved || hasViewAuth) {
        let signUp = event.signUps.find(s => s._id === signUpId);

        if (signUp) {
          if (hasViewAuth || (signUp.user && signUp.user === user.volunteer)) {
            Event.findByIdAndUpdate(eventId,
                {$pull: {'signUps': {_id: signUpId}}}).exec((err) => {
              if (err) {
                // todo better validation
                logger.error(`database error on deleting sign-up: ${error}`);
                res.sendStatus(500);
              } else {
                logger.info(`deleted sign-up ${signUpId}`);
                res.sendStatus(200);
              }
            });
          } else {
            // we don't have view authorization
            if (signUp.user) {
              logger.warn(
                  `user with volunteer id ${user.volunteer} does not have authorization to delete this sign-up (volunteer ${signUp.user})`);
            } else {
              logger.warn(
                  `user does not have authorization to delete anonymous sign-ups`);
            }
            res.sendStatus(404);
          }
        } else {
          // doesn't exist
          logger.warn(`sign-up ${signUpId} does not exist in event ${eventId}`);
          res.sendStatus(404);
        }
      } else {
        // event doesn't exist or we don't have view authorization
        logger.warn(`event ${eventId} exists but has not been approved yet`);
        res.sendStatus(404);
      }
    });

module.exports = router;
