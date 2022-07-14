const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

// ----------------create a bookModel using schema-------------------------------
const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        trim:true,
        required: 'Title must be Present',
        unique: true
    },
    excerpt: {
        type: String,
        trim:true,
        required: 'Excerpt must be Present'
    },
    userId: {
        type: ObjectId,
        ref: 'User',
        required: 'UserId must be Present'
    },
    ISBN: {
        type: String,
        trim:true,
        required: 'ISBN must be Present',
        unique: true
    },
    category: {
        type: String,
        trim:true,
        required: 'Category must be Present',
    },
    subcategory: {
        type: [String],
        trim:true,
        required: 'Subcategory must be Present',
    },
    reviews: {
        type: Number,
        default: 0
    },
    deletedAt: {
        type: Date,
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    releasedAt: {
        type:Date,
        required:'ReleasedAt must be Present'
    },
}, {
    timestamps: true
})

module.exports = mongoose.model('Book', bookSchema)