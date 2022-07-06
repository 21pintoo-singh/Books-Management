const mongoose = require("mongoose")
const moment = require("moment")

let isValidRequestBody = function (body) {
    if (Object.keys(body).length === 0) return false;
    return true;
}

let isEmpty = function (value) {
    if (typeof value === 'undefined' || value === null) return true;
    if (typeof value === 'string' && value.trim().length === 0) return true;
    return false;
}

let isValidPhone = function (number) {
    let phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(number);
}

let isValidISBN = function (ISBN) {
    let ISBNRegex = /^[0-9]*$/
    return ISBNRegex.test(ISBN);
}

let isValidEmail = function (email) {
    let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    return emailRegex.test(email)
}

let isValidPassword = function (password) {
    let passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,15}$/
    return passwordRegex.test(password)
}

let isValidDateFormat = function (date) {
    let dateFormatRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/
    return dateFormatRegex.test(date)
}

let isValidDate = function (date) {
    return moment(date).isValid()
}

let isValidObjectId = function (ObjectId) {
    return mongoose.isValidObjectId(ObjectId)
}



module.exports = {
    isValidRequestBody,
    isEmpty,
    isValidEmail,
    isValidPhone,
    isValidPassword,
    isValidObjectId,
    isValidDateFormat,
    isValidDate,
    isValidISBN
}