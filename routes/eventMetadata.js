const express = require('express');
const passport = require('passport');

const router = express.Router();

const logger = require('../logging');
const EventMeta = require('../models/eventMetadata');

router.get('/', passport.authenticate(['jwt', 'anon'], {session: false}),
    async (req, res) => {
      const user = req.user;

      logger.debug(`user: ${user}`);

      let meta = await EventMeta.find().exec();

      logger.debug(`found ${meta.length} meta tags`);
      res.json(meta);
    });

router.get('/:metaId',
    passport.authenticate(['jwt', 'anon'], {session: false}),
    (req, res) => {
      let metaId = req.params.metaId;
      const user = req.user;
      logger.debug(`user: ${user}`);

      EventMeta.findById(metaId).exec((err, doc) => {
        if (err) {
          logger.error(`database error when finding event metadata: ${err}`);
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

        if (!body.dataType) {
          missingOrMalformed.push("dataType");
        }

        if (missingOrMalformed.length > 0) {
          logger.warn(
              `Event meta creation request had missing or malformed fields: ${missingOrMalformed}`);
          return res.status(400).send(
              `Missing or malformed fields: ${missingOrMalformed}`);
        }

        const meta = new EventMeta(body);

        let isNew;

        if (await EventMeta.findById(body._id)) {
          logger.info(`Replacing existing event meta ${body._id}`);
          isNew = false;
        } else {
          logger.info(`Creating new event meta with ID ${body._id}`);
          isNew = true;
        }

        // FIXME this doesn't work when updating
        meta.save((err, doc) => {
          if (err) {
            logger.error(`database error when saving metadata: ${err}`);
            res.sendStatus(500);
          } else {
            res.status(isNew ? 201 : 200).json(doc);
          }
        });

      } else {
        logger.warn(
            `user ${user._id} attempting to add event metadata without permission`);
        res.sendStatus(403);
      }
    });

router.delete('/:metaId',
    passport.authenticate(['jwt'], {session: false}),
    async (req, res) => {
      let metaId = req.params.metaId;
      const user = req.user;
      logger.debug(`user: ${user}`);

      if (user.admin) {
        EventMeta.findByIdAndDelete(metaId).exec((err, doc) => {
          if (err) {
            logger.error(`database error when deleting event meta: ${err}`);
            res.sendStatus(500);
          } else if (doc) {
            logger.info(`Deleted event meta ${metaId}`);
            res.sendStatus(200);
          } else {
            res.sendStatus(404);
          }
        });
      } else {
        logger.warn(
            `user ${user._id} attempting to delete event meta without permission`);
        res.sendStatus(403);
      }
    });


module.exports = router;
