const express = require('express');
let router = express.Router();
const user = require('../Controller/userController')

router.post("/", (req, res) => {
      res.send('Done')
  })

  router.post("/register", user.registerUser)

  module.exports = router;