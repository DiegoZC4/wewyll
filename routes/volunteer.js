const express = require('express');
const passport = require('passport');
const {v4: uuidv4} = require('uuid');
const logger = require('../logging');

const router = express.Router();

const Volunteer = require('../models/volunteer');
const UserData = require('../models/user');

// router will be mounted on /volunteer
router.get('/',
    passport.authenticate(['jwt'], {session: false}),
    (req, res) => {
      const user = req.user;
      logger.debug(`user: ${user}`);

      if (user.admin) {
        logger.debug('user is admin');

        Volunteer.find((err, docs) => {
          if (err) {
            logger.error(`database error when enumerating volunteers: ${err}`);
            res.sendStatus(500);
          } else {
            logger.debug(`replying with ${docs.length} volunteers`);
            // TODO handle identifying info (e.g. in common fields); are there
            //  legal/other requirements re: just handing all volunteer data off to
            //  anyone with admin perms?
            res.json(docs);
          }
        });
      } else {
        logger.warn(
            'user attempting to enumerate volunteers without proper permissions');
        res.sendStatus(403);
      }
    });

router.post('/',
    passport.authenticate(['jwt'], {session: false}),
    (req, res) => {
      const user = req.user;
      const body = req.body;

      logger.debug(`user: ${user}`);
      logger.debug(`body: ${body}`);

      // TODO verify common fields are actual valid fields?
      if (!body.name) {
        logger.warn('request body missing required parameter: name');
        res.status(400).send('missing required parameter: name');
      }

      const newVol = new Volunteer(body);
      newVol._id = uuidv4();

      if (!user.volunteer) {
        logger.debug('user is not associated with a volunteer instance yet');
        user.volunteer = newVol._id;
        user.save((err, doc) => {
          if (err) {
            logger.error(`database error updating volunteer ID: ${err}`);
          } else {
            logger.info(
                `user ${doc._id} is now associated with volunteer ${doc.volunteer}`);
          }
        });
      } else {
        logger.debug(
            `user is already associated with volunteer ${user.volunteer}`);
        if (user.admin) {
          logger.debug(`user is admin, can create anyway`);
        } else {
          return res.sendStatus(403);
        }
      }

      newVol.save((err, doc) => {
        if (err) {
          logger.error(`database error saving new volunteer: ${err}`);
          res.sendStatus(500);
        } else {
          logger.info(`created volunteer ${doc._id}`);
          // res.status(201).json(doc);
        }
      });
    });

router.get('/:volunteerId',
    passport.authenticate(['jwt'], {session: false}),
    (req, res) => {
      let volunteerId = req.params.volunteerId;
      const user = req.user;
      logger.debug(`user: ${user}`);

      if (user.volunteer === volunteerId || user.admin) {
        Volunteer.findById(volunteerId).exec((err, doc) => {
          if (err) {
            logger.error(`database error on volunteer query: ${err}`);
            res.sendStatus(500);
          } else {
            if (doc) {
              res.json(doc);
            } else {
              res.sendStatus(404);
            }
          }
        });
      } else {
        res.sendStatus(403);
      }
    });

router.patch('/:volunteerId',
    passport.authenticate(['jwt'], {session: false}),
    async (req, res) => {
      let volunteerId = req.params.volunteerId;
      const user = req.user;
      const body = req.body;
      logger.debug(`user: ${user}`);
      logger.debug(`body: ${body}`);

      if (user.volunteer === volunteerId || user.admin) {
        const volunteer = await Volunteer.findById(volunteerId);
        if (body.name) {
          volunteer.name = body.name;
        }
        if (body.commonFieldPrefill) {
          volunteer.commonFieldPrefill = body.commonFieldPrefill;
        }

        volunteer.save((err, doc) => {
          if (err) {
            logger.error(`database error when editing volunteer: ${err}`);
            res.sendStatus(500);
          } else {
            logger.info(`updated volunteer ${volunteerId}`);
            res.json(doc);
          }
        });
      } else {
        res.sendStatus(403);
      }
    });

router.delete('/:volunteerId', passport.authenticate(['jwt'], {session: false}),
    async (req, res) => {
      let volunteerId = req.params.volunteerId;
      const user = req.user;
      logger.debug(`user: ${user}`);

      if (user.volunteer === volunteerId || user.admin) {
        Volunteer.findByIdAndDelete(volunteerId).exec((err, doc) => {
          if (err) {
            logger.error(`database error when deleting volunteer: ${err}`);
            res.sendStatus(500);
          } else if (!doc) {
            res.sendStatus(404);
          } else {
            logger.info(`deleted volunteer ${volunteerId}`);

            UserData.updateMany(
                {volunteer: volunteerId},
                {$unset: {"volunteer": ""}}
            ).exec((err, result) => {
              if (err) {
                logger.error(`database error when updating user info: ${err}`);
              } else {
                logger.info(
                    `updated attached volunteer for ${result.modifiedCount} users`);
              }
            });

            res.sendStatus(200);
          }
        });
      } else {
        res.sendStatus(403);
      }
    });

module.exports = router;
