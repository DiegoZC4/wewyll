const express = require('express');
const passport = require('passport');
const logger = require('../logging');

const router = express.Router();

const UserData = require('../models/user');

// router will be mounted on /user
router.get('/',
    passport.authenticate(['jwt'], {session: false}),
    (req, res) => {
      const user = req.user;
      logger.debug(`user: ${user}`);

      if (user.admin) {
        logger.debug('user is admin');

        UserData.find((err, docs) => {
          if (err) {
            logger.error(`database error when enumerating users: ${err}`);
            res.sendStatus(500);
          } else {
            logger.debug(`replying with ${docs.length} users`);
            res.json(docs);
          }
        });
      } else {
        logger.warn(
            'user attempting to enumerate users without proper permissions');
        res.sendStatus(403);
      }
    });

router.get('/:userId',
    passport.authenticate(['jwt'], {session: false}),
    (req, res) => {
      let userId = req.params.userId;
      const user = req.user;
      logger.debug(`user: ${user}`);

      if (user._id === userId) {
        logger.debug('user is getting info about themselves');
        res.json(user);
      } else if (user.admin) {
        logger.debug('user is admin');
        UserData.findById(userId).exec((err, doc) => {
          if (err) {
            logger.error(`database error when finding user: ${err}`);
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
        logger.warn('user attempting to GET user without proper permissions');
        res.sendStatus(403);
      }
    });

router.put('/:userId',
    passport.authenticate(['jwt'], {session: false}),
    async (req, res) => {
      let userId = req.params.userId;
      const user = req.user;
      const body = req.body;
      logger.debug(`user: ${user}`);
      logger.debug(`body: ${body}`);

      if (user.admin) {
        logger.debug('user is admin');

        if (!body._id || body._id !== userId) {
          logger.warn(
              `User create/edit request had missing or malformed _id field`);
          return res.status(400).send(`Missing or malformed _id field`);
        }

        const user = new UserData(body);

        let isNew;

        if (await UserData.findById(body._id)) {
          logger.info(`Replacing existing user ${body._id}`);
          isNew = false;
        } else {
          logger.info(`Creating new user with ID ${body._id}`);
          isNew = true;
        }

        user.save((err, doc) => {
          if (err) {
            logger.error(`database error when saving user: ${err}`);
            res.sendStatus(500);
          } else {
            res.status(isNew ? 201 : 200).json(doc);
          }
        });

      } else {
        logger.warn(
            `user ${user._id} attempting to add user without permission`);
        res.sendStatus(403);
      }
    });

router.delete('/:userId',
    passport.authenticate(['jwt'], {session: false}),
    async (req, res) => {
      let userId = req.params.userId;
      const user = req.user;
      logger.debug(`user: ${user}`);

      if (user.admin) {
        logger.debug('user is admin');

        UserData.findByIdAndDelete(userId).exec((err, doc) => {
          if (err) {
            logger.error(`database error when deleting user: ${err}`);
            res.sendStatus(500);
          } else if (doc) {
            logger.info(`Deleted user ${userId}`);
            res.sendStatus(200);
          } else {
            res.sendStatus(404);
          }
        });
      } else {
        logger.warn(
            `user ${user._id} attempting to delete user without permission`);
        res.sendStatus(403);
      }
    });

module.exports = router;
