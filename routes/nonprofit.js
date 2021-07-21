const express = require('express');
const passport = require('passport');
const {v4: uuidv4} = require('uuid');
const logger = require('../logging');

const router = express.Router();

const nonprofit = require('../models/nonprofit');

// router will be mounted on /nonprofit
router.get('/',
    passport.authenticate(['jwt', 'anon'], {session: false}),
    async (req, res) => {
      const user = req.user;
      logger.debug(`user: ${user}`);

      let orgs = await nonprofit.find().exec();

      logger.debug(`found ${orgs.length} nonprofits`);
      res.json(orgs);
    });

router.post('/',
    passport.authenticate(['jwt'], {session: false}),
    async (req, res) => {
      const user = req.user;
      const body = req.body;

      logger.debug(`user: ${user}`);
      logger.debug(`body: ${body}`);

      if (user) {
        const newOrg = new nonprofit(body);
        newOrg._id = uuidv4();
        const response = await newOrg.save();
        if (response) {
          logger.info(`created new nonprofit ${response._id}`);
          res.status(201).json(response);
          user.nonprofit = newOrg._id;
          user.save((err, doc) => {
            if (err) {
              logger.error(`database error updating nonprofit ID: ${err}`);
            } else {
              logger.info(
                  `user ${doc._id} is now associated with nonprofit ${doc.nonprofit}`);
            }
          });
        } else {
          logger.error(`database error on creating new nonprofit`);
          res.sendStatus(500);
        }
      } else {
        logger.debug(
            'user does not have authorization to create nonprofits');
        res.sendStatus(403);
      }
    });

router.get('/:orgId',
    passport.authenticate(['jwt', 'anon'], {session: false}),
    (req, res) => {
      let orgId = req.params.orgId;
      const user = req.user;

      logger.debug(`user: ${user}`);

      nonprofit.findById(orgId).exec((err, doc) => {
        if (err) {
          logger.error(`database error on nonprofit query: ${err}`);
          res.sendStatus(500);
        } else {
          if (doc) {
            res.json(doc);
          } else {
            res.sendStatus(404);
          }
        }
      });

    });

router.patch('/:orgId',
    passport.authenticate(['jwt'], {session: false}),
    async (req, res) => {
      let orgId = req.params.orgId;
      const user = req.user;
      const body = req.body;

      logger.debug(`user: ${user}`);
      logger.debug(`request body: ${body}`);

      if (user.admin) {
        logger.debug('user is admin');
      } else if (user.nonprofit && user.nonprofit === orgId) {
        logger.debug('user is from this nonprofit');
      } else {
        logger.warn(`user does not have permission to edit nonprofit`);
        return res.sendStatus(403);
      }

      let org = await nonprofit.findById(orgId).exec();
      if (org) {
        // TODO more fields
        if (body._id && body._id !== org._id) {
          logger.warn(`user is trying to change nonprofit ID`);
        }
        delete body._id;

        Object.assign(org, body);

        org.save((err, doc) => {
          if (err) {
            logger.error(
                `database error on saving edited nonprofit: ${err}`);
            return res.sendStatus(500);
          }

          logger.info(`edited nonprofit ${doc._id}`);
          return res.json(doc);
        });
      } else {
        return res.sendStatus(404);
      }
    });

router.delete('/:orgId',
    passport.authenticate(['jwt'], {session: false}),
    async (req, res) => {
      let orgId = req.params.orgId;
      const user = req.user;

      logger.debug(`user: ${user}`);

      if (user.admin) {
        logger.debug('user is admin');
      } else if (user.nonprofit && user.nonprofit === orgId) {
        logger.debug('user is from this nonprofit');
      } else {
        logger.warn(`user does not have permission to delete nonprofit`);
        return res.sendStatus(403);
      }

      let org = await nonprofit.findById(orgId).exec();
      if (org) {
        org.delete((err, doc) => {
          if (err) {
            logger.error(`database error on deleting nonprofit: ${err}`);
            return res.sendStatus(500);
          }

          logger.info(`deleted nonprofit ${doc._id}`);
          return res.sendStatus(200);
        });
      } else {
        return res.sendStatus(404);
      }
    });

module.exports = router;
