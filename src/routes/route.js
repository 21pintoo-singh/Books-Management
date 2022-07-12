const express = require('express');
let router = express.Router();
const user = require('../Controller/userController')
const book = require('../Controller/bookController')
const review = require('../Controller/reviewController')


// auth require
const { authenticate, bookAuthorization, userAuthorization } = require('../middleware/auth')


// ------------------------User Creation And login api call-----------------------------
router.post("/register", user.registerUser)
router.post("/login", user.loginUser)



//------------------------Book Creation And all books api call-----------------
router.post("/books", authenticate, userAuthorization, book.createBook)
router.get('/books', authenticate, book.getBook)
router.get('/books/:bookId', authenticate, book.getBookById)
router.put("/books/:bookId", authenticate, bookAuthorization, book.bookUpdate)
router.delete("/books/:bookId", authenticate, bookAuthorization, book.delBookById)


//---------------------------Review books All Api call--------------------------------
router.post("/books/:bookId/review", review.create)
router.put("/books/:bookId/review/:reviewId", review.update)
router.delete("/books/:bookId/review/:reviewId", review.deleted)

// validation of url
router.all('/**', (req, res)=>res.status(400).send({status:false,message:"enter path param"}));




module.exports = router;