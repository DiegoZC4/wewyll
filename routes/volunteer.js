const express = require('express');

const router = express.Router();

// router will be mounted on /volunteer
router.get('/', (req, res) => {
  // TODO not implemented
});

router.post('/', (req, res) => {
  // TODO not implemented
});

router.get('/:volunteerId', (req, res) => {
  let volunteerId = req.params.volunteerId;
  // TODO not implemented
});

router.patch('/:volunteerId', (req, res) => {
  let volunteerId = req.params.volunteerId;
  // TODO not implemented
});

router.delete('/:volunteerId', (req, res) => {
  let volunteerId = req.params.volunteerId;
  // TODO not implemented
});

module.exports = router;
