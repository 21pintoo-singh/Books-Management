const BooksModel = require("../Modules/BooksModel");
const reviewsModel = require("../Modules/ReviewModel");

const moment = require('moment')

//destructure of validation.js
const {
    isValidRequestBody,
    isEmpty,
    isValidObjectId,
    isValidDate,
    isValidDateFormat,
    isValidISBN
} = require("../utility/validation")

//====================================================[API TO CREATE BOOK]==========================================================
const createBook = async (req, res) => {
    try {
        const data = req.body;

        if (!isValidRequestBody(data)) return res.status(400).send({
            status: false,
            message: "Body Empty"
        })

        let {
            title,
            ISBN,
            releasedAt,
            category,
            userId,
            subcategory,
            excerpt
        } = data;

        //Validations...
        if (isEmpty(releasedAt)) {
            releasedAt = moment(releasedAt).format("YYYY-MM-DD")
        } else {
            if (!isValidDateFormat(releasedAt)) return res.status(400).send({
                status: false,
                message: "Date must be in the format YYYY-MM-DD"
            })

            if (!isValidDate(releasedAt)) return res.status(400).send({
                status: false,
                message: "Invalid Date"
            })

        }

        if (isEmpty(excerpt)) return res.status(400).send({
            status: false,
            message: "Excerpt is required"
        })


        if (isEmpty(category)) return res.status(400).send({
            status: false,
            message: "Category required"
        })

        if (isEmpty(userId)) return res.status(400).send({
            status: false,
            message: "UserId required"
        })
        if (!isValidObjectId(userId)) return res.status(400).send({
            status: false,
            message: "UserId invalid"
        })

        if (isEmpty(subcategory)) return res.status(400).send({
            status: false,
            message: "Subcategory required"
        })

        if (isEmpty(title)) return res.status(400).send({
            status: false,
            message: "Title required"
        })


        if (isEmpty(ISBN)) return res.status(400).send({
            status: false,
            message: "ISBN required"
        })

        if (!isValidISBN(ISBN)) return res.status(400).send({
            status: false,
            message: "Enter a valid ISBN Number"
        })

        // DB Calls

        const isTitleUnique = await BooksModel.findOne({
            title
        }).catch(e => null);
        if (isTitleUnique) return res.status(400).send({
            status: false,
            message: "Title already exist"
        })

        const isISBNUnique = await BooksModel.findOne({
            ISBN
        }).catch(e => null);
        if (isISBNUnique) return res.status(400).send({
            status: false,
            message: "ISBN already exist"
        })

        //Book creation
        const createBook = await BooksModel.create({
            title,
            excerpt,
            userId,
            ISBN,
            category,
            subcategory,
            releasedAt: moment(releasedAt).format("YYYY-MM-DD"),
        })

        return res.status(201).send({
            status: true,
            message: "Book created successfully",
            data: createBook
        })

    } catch (error) {
        return res.status(500).send({
            status: false,
            message: error.message
        })
    }
}
 module.exports.createBook=createBook;

//==============================[GET BOOK API]==========================================

const getBook = async function (req, res) {
    try {
        const queryData = req.query;

        let obj = {
            isDeleted: false
        }

        if (Object.keys(queryData).length !== 0) {

            let {
                userId,
                category,
                subcategory
            } = queryData;

            if (!isEmpty(userId)) {
                if (!isValidObjectId(userId)) return res.status(400).send({
                    status: false,
                    message: "Invalid userId"
                })
                obj.userId = userId
            }
            if (!isEmpty(category)) {
                obj.category = category
            }
            if (!isEmpty(subcategory)) {
                obj.subcategory = {
                    $in: subcategory
                }
            }
        }


        let findQuery = await BooksModel.find(obj).select({
            ISBN: 0,
            subcategory: 0,
            isDeleted: 0,
            createdAt: 0,
            updatedAt: 0,
            __v: 0
        }).sort({
            title: 1
        })
        if (findQuery.length == 0) {
            return res.status(404).send({
                status: false,
                message: "No such book found"
            })
        }
        res.status(200).send({
            status: true,
            data: findQuery
        })

    } catch (error) {
        res.status(500).send({
            status: false,
            message: error.message
        })
    }
}

module.exports.getBook=getBook;

// =============================[GET BOOK BY BOOK-ID]============================

const getBookById = async (req, res) => {
    try {
        const bookId = req.params.bookId
        //checking valid book id
        if (!isValidObjectId(bookId)) return res.status(400).send({
            status: false,
            message: "BookId invalid"
        })
        // checking book present in db
        const data = await BooksModel.findOne({
            _id: bookId
        }).catch(e => null)

        if (!data) return res.status(404).send({
            status: false,
            message: "Book does not exist"
        })

        if (data.isDeleted) return res.status(404).send({
            status: false,
            message: "Book already deleted"
        })

        let obj = {
            _id: data._id,
            title: data.title,
            excerpt: data.excerpt,
            userId: data.userId,
            category: data.category,
            subcategory: data.subcategory,
            deleted: data.deleted,
            reviews: data.reviews,
            deletedAt: data.deletedAt,
            releasedAt: data.releasedAt,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt
        }

        // get arr of reviews
        const reviewArr = await reviewsModel.find({
            bookId: data._id,
            isDeleted: false
        }).select({
            __v: 0,
            isDeleted: 0
        }).catch(_ => [])

        obj.reviewsData = reviewArr;

        return res.status(200).send({
            status: true,
            message: "Book List",
            data: obj
        })
    } catch (error) {
        res.status(500).send({
            status: false,
            message: error.message
        })
    }
}

module.exports.getBookById=getBookById;


//==========================================================[BOOK UPDATE API]===========================================================
const bookUpdate = async (req, res) => {
    try {
        let bookId = req.params.bookId
        let updateData = req.body
        let userId = req.decodeToken.userId

        let {
            title,
            excerpt,
            ISBN,
            releasedAt
        } = updateData
        //check valid book id
        let validBook = await BooksModel.findOne({
            _id: bookId,
            userId: userId
        }).catch(err => null)

        if (!validBook) return res.status(404).send({
            status: false,
            message: "Book not found"
        })

        if (validBook.isDeleted) return res.status(404).send({
            status: false,
            message: "Book is already Deleted"
        })
        if (!isEmpty(excerpt)) {
            validBook.excerpt = excerpt;
        }
        if (!isEmpty(releasedAt)) {
            if (!isValidDateFormat(releasedAt)) return res.status(400).send({
                status: false,
                message: "Date must be in the format YYYY-MM-DD"
            })
            if (!isValidDate(releasedAt)) return res.status(400).send({
                status: false,
                message: "Invalid Date"
            })
            validBook.releasedAt = moment(releasedAt).format("YYYY-MM-DD");
        }
        if (!isEmpty(title)) {
            let checktitle = await BooksModel.findOne({
                title: title
            }).catch(er => null)
            if (checktitle) {
                return res.status(400).send({
                    status: false,
                    message: "Title is already exits plz enter a new title"
                })
            } else {
                validBook.title = title
            }
        }
        if (!isEmpty(ISBN)) {
            let checkISBN = await BooksModel.findOne({
                ISBN
            }).catch(er => null)
            if (checkISBN) {
                return res.status(400).send({
                    status: false,
                    message: "ISBN is already exits plz enter a new ISBN"
                })
            } else {
                validBook.ISBN = ISBN
            }
        }
        await validBook.save();
        res.status(200).send({
            status: true,
            message: "Update succesful",
            data: validBook
        })

    } catch (error) {
        return res.status(500).send({
            status: false,
            message: error.message
        })

    }
}

module.exports.bookUpdate=bookUpdate;


//===================================[DELETE BOOK API]==========================================

const delBookById = async (req, res) => {
    try {
        let userId = req.decodeToken.userId
        let bookId = req.params.bookId

        //check book id in db
        
        let validBookId = await BooksModel.findById(bookId).catch(err => null)
        if (!validBookId) return res.status(404).send({
            status: false,
            message: "Book not found"
        })
        if (validBookId.isDeleted) return res.status(404).send({
            status: false,
            message: "Book is already Deleted"
        })
        //Doing changes in book document
        let deletion = await BooksModel.findOneAndUpdate({
            _id: bookId,
            userId: userId
        }, {
            $set: {
                isDeleted: true,
                deletedAt: new Date(),
                reviews: 0
            }
        }).select({
            __v: 0
        })

        // Deletion of reviews if book is deleted
        if (deletion) {
            await reviewsModel.updateMany({
                bookId
            }, {
                $set: {
                    isDeleted: true
                }
            })
        }
        res.status(200).send({
            status: true,
            message: 'Book deleted successfully '
        })
    } catch (er) {
        res.status(500).send({
            status: false,
            message: er.message
        })
    }
}

module.exports.delBookById=delBookById;






