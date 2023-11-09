const express = require('express');
const router = express.Router();
const dbModule = require('./dbModule');

router.get('/', async (req, res) => {
  try {
    const nodes = await dbModule.getNodes();
    res.json(nodes);
  } catch (error) {
    res.status(500).send('Error retrieving nodes from the database');
  }
});

module.exports = router;