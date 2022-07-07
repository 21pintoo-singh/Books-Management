const express = require('express');
let router = express.Router();
const user = require('../Controller/userController')
const book = require('../Controller/bookController')

router.post("/", (req, res) => {
      res.send('ok')
  })

//   For User Creation
  router.post("/register", user.registerUser)
  router.post("/login", user.loginUser)

// For Path Call
router.post("/books", book.createBook)
router.get('/books', book.getBook)
router.get('/books/:bookId', book.getBookById)
router.put("/books/:bookId", book.bookUpdate)
router.delete("/books/:bookId", book.
delBookById)

  module.exports = router;