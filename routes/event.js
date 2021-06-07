const express = require('express');

const router = express.Router();

// router will be mounted on /event
router.get('/', (req, res) => {
  // TODO not implemented
});

router.post('/', (req, res) => {
  // TODO not implemented
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
