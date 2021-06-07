const express = require('express');

const router = express.Router();

// router will be mounted on /organization
router.get('/', (req, res) => {
  // TODO not implemented
});

router.post('/', (req, res) => {
  // TODO not implemented
});

router.get('/:orgId', (req, res) => {
  let orgId = req.params.orgId;
  // TODO not implemented
});

router.patch('/:orgId', (req, res) => {
  let orgId = req.params.orgId;
  // TODO not implemented
});

router.delete('/:orgId', (req, res) => {
  let orgId = req.params.orgId;
  // TODO not implemented
});

module.exports = router;
