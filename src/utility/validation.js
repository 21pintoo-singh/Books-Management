const mongoose = require("mongoose")
const moment = require("moment")


//-------------------------if invalid req Body----------------------------
let isValidRequestBody = function (body) {
    if (Object.keys(body).length === 0) return false;
    return true;
}

//---------------------------if JSON obj is empty------------------------------------------
let isEmpty = function (value) {
    if (typeof value === 'undefined' || value === null) return true;
    if (typeof value === 'string' && value.trim().length === 0) return true;
    return false;
}

// regex use for phone number validation
let isValidPhone = function (number) {
    let phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(number);
}

// regex use for ISBN validation
let isValidISBN = function (ISBN) {
    let ISBNRegex = /(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)/
    return ISBNRegex.test(ISBN);
}

// regex use for email validation
let isValidEmail = function (email) {
    let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    return emailRegex.test(email)
}

// regex use for password validation
let isValidPassword = function (password) {
    let passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,15}$/
    return passwordRegex.test(password)
}

// regex use dateformat validation
// let isValidDateFormat = function (date) {
//     // let dateFormatRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/

//     let dateFormatRegex = /^([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/

//     // /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/
//     return dateFormatRegex.test(date)
// }

const isValidDateFormat = (date) => {
    if (/^([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/.test(date))
        return true
}



let isValidDate = function (date) {
    return moment(date).isValid()
}

let isValidObjectId = function (ObjectId) {
    return mongoose.isValidObjectId(ObjectId)
}


module.exports = {
    isValidRequestBody, isEmpty, isValidEmail, isValidPhone, isValidPassword, isValidObjectId, isValidDateFormat, isValidDate, isValidISBN
}