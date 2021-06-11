const express = require('express');
const passport = require('passport');
const {v4: uuidv4} = require('uuid');
const logger = require('../logging');

const router = express.Router();

const Organization = require('../models/organization');

// router will be mounted on /organization
router.get('/',
    passport.authenticate(['jwt', 'anon'], {session: false}),
    async (req, res) => {
      const user = req.user;
      logger.debug(`user: ${user}`);

      let orgs = await Organization.find().exec();

      logger.debug(`found ${orgs.length} organizations`);
      res.json(orgs);
    });

router.post('/',
    passport.authenticate(['jwt'], {session: false}),
    async (req, res) => {
      const user = req.user;
      const body = req.body;

      logger.debug(`user: ${user}`);
      logger.debug(`body: ${body}`);

      if (user.admin) {
        const newOrg = new Organization(body);
        newOrg._id = uuidv4();
        const response = await newOrg.save();
        if (response) {
          logger.info(`created new organization ${response._id}`);
          res.status(201).json(response);
        } else {
          logger.error(`database error on creating new organization`);
          res.sendStatus(500);
        }
      } else {
        logger.debug(
            'user does not have authorization to create organizations');
        res.sendStatus(403);
      }
    });

router.get('/:orgId',
    passport.authenticate(['jwt', 'anon'], {session: false}),
    (req, res) => {
      let orgId = req.params.orgId;
      const user = req.user;

      logger.debug(`user: ${user}`);

      Organization.findById(orgId).exec((err, doc) => {
        if (err) {
          logger.error(`database error on organization query: ${err}`);
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
      } else if (user.organization && user.organization === orgId) {
        logger.debug('user is from this organization');
      } else {
        logger.warn(`user does not have permission to edit organization`);
        return res.sendStatus(403);
      }

      let org = await Organization.findById(orgId).exec();
      if (org) {
        // TODO more fields
        if (body._id && body._id !== org._id) {
          logger.warn(`user is trying to change organization ID`);
        }
        delete body._id;

        Object.assign(org, body);

        org.save((err, doc) => {
          if (err) {
            logger.error(
                `database error on saving edited organization: ${err}`);
            return res.sendStatus(500);
          }

          logger.info(`edited organization ${doc._id}`);
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
      } else if (user.organization && user.organization === orgId) {
        logger.debug('user is from this organization');
      } else {
        logger.warn(`user does not have permission to delete organization`);
        return res.sendStatus(403);
      }

      let org = await Organization.findById(orgId).exec();
      if (org) {
        org.delete((err, doc) => {
          if (err) {
            logger.error(`database error on deleting organization: ${err}`);
            return res.sendStatus(500);
          }

          logger.info(`deleted organization ${doc._id}`);
          return res.sendStatus(200);
        });
      } else {
        return res.sendStatus(404);
      }
    });

module.exports = router;
