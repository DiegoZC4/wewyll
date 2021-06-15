const express = require('express');
const passport = require('passport');
const logger = require('../logging');

const router = express.Router();

const CommonField = require('../models/commonfield');

// router will be mounted on /commonfield
router.get('/',
    passport.authenticate(['jwt', 'anon'], {session: false}),
    (req, res) => {
      const user = req.user;
      logger.debug(`user: ${user}`);

      CommonField.find((err, docs) => {
        if (err) {
          logger.error(`database error when enumerating common fields: ${err}`);
          res.sendStatus(500);
        } else {
          logger.debug(`replying with ${docs.length} fields`);
          res.json(docs);
        }
      });
    });

router.get('/:fieldId',
    passport.authenticate(['jwt', 'anon'], {session: false}),
    (req, res) => {
      let fieldId = req.params.fieldId;
      const user = req.user;
      logger.debug(`user: ${user}`);

      CommonField.findById(fieldId).exec((err, doc) => {
        if (err) {
          logger.error(`database error when finding common field: ${err}`);
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

router.put('/:fieldId',
    passport.authenticate(['jwt'], {session: false}),
    async (req, res) => {
      let fieldId = req.params.fieldId;
      const user = req.user;
      const body = req.body;
      logger.debug(`user: ${user}`);
      logger.debug(`body: ${body}`);

      if (user.admin) {
        logger.debug('user is admin');
        let missingOrMalformed = [];

        if (!body._id || body._id !== fieldId) {
          missingOrMalformed.push("_id");
        }

        if (!body.label) {
          missingOrMalformed.push("label");
        }

        if (!body.type) {
          missingOrMalformed.push("type");
        }

        if (!body.required) {
          missingOrMalformed.push("required");
        }

        if (missingOrMalformed.length > 0) {
          logger.warn(
              `Field creation request had missing or malformed fields: ${missingOrMalformed}`);
          return res.status(400).send(
              `Missing or malformed fields: ${missingOrMalformed}`);
        }

        const field = new CommonField(body);

        let isNew;

        if (await CommonField.findById(body._id)) {
          logger.info(`Replacing existing common field ${body._id}`);
          isNew = false;
        } else {
          logger.info(`Creating new common field with ID ${body._id}`);
          isNew = true;
        }

        field.save((err, doc) => {
          if (err) {
            logger.error(`database error when saving common field: ${err}`);
            res.sendStatus(500);
          } else {
            res.status(isNew ? 201 : 200).json(doc);
          }
        });

      } else {
        logger.warn(
            `user ${user._id} attempting to add common field without permission`);
        res.sendStatus(403);
      }
    });

router.delete('/:fieldId',
    passport.authenticate(['jwt'], {session: false}),
    async (req, res) => {
      let fieldId = req.params.fieldId;
      const user = req.user;
      logger.debug(`user: ${user}`);

      if (user.admin) {
          CommonField.findByIdAndDelete(fieldId).exec((err, doc) => {
            if (err) {
              logger.error(`database error when deleting common field: ${err}`);
              res.sendStatus(500);
            } else if (doc) {
              logger.info(`Deleted common field ${fieldId}`);
              res.sendStatus(200);
            } else {
              res.sendStatus(404);
            }
          });
      } else {
        logger.warn(
            `user ${user._id} attempting to delete common field without permission`);
        res.sendStatus(403);
      }
    });

module.exports = router;
