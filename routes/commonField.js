const express = require('express');

const router = express.Router();

// router will be mounted on /commonfield
router.get('/', (req, res) => {
  // TODO not implemented
});

router.get('/:fieldId', (req, res) => {
  let fieldId = req.params.fieldId;
  // TODO not implemented
});

router.put('/:fieldId', (req, res) => {
  let fieldId = req.params.fieldId;
  // TODO not implemented
});

router.delete('/:fieldId', (req, res) => {
  let fieldId = req.params.fieldId;
  // TODO not implemented
});

module.exports = router;
