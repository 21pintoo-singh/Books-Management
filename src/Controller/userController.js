const UserModel = require("../Modules/UserModel");

//-----------------------import validation function from validation.js------------------
const { isValidRequestBody, isEmpty, isValidPhone, isValidEmail, isValidPassword } = require("../utility/validation.js")

const jwt = require('jsonwebtoken');

// ----------------------------for ragisterUser------------------------
const registerUser = async (req, res) => {
  try {
    const data = req.body;

    // user is required
    if (!isValidRequestBody(data)) return res.status(400).send({ status: false, message: "User verification are required" })

    // Destracture all of data
    let { title, name, phone, email, password, address } = data

    //if empty tittle
    if (isEmpty(title)) return res.status(400).send({ status: false, message: "Title is required" })

    //Enum is require 
    if (['Mr', 'Mrs', 'Miss'].indexOf(title) == -1) return res.status(400).send({ status: false, message: "Title must be Mr, Mrs, Miss" })

    // if empty name
    if (isEmpty(name)) return res.status(400).send({ status: false, message: "User name is required" })

    // name regex validation
    if (!name.match(/^[#.a-zA-Z\s,-]+$/)) return res.status(400).send({ status: false, message: "User name is Invalid !" })

    // if empty number
    if (isEmpty(phone)) return res.status(400).send({ status: false, message: "Phone Number is required" })

    // valid phone number
    if (!isValidPhone(phone)) return res.status(400).send({ status: false, message: `${phone} is not valid phone number` })


    // if empty  email
    if (isEmpty(email)) return res.status(400).send({ status: false, message: "Email is required" })

    // email validation
    if (!isValidEmail(email)) return res.status(400).send({ status: false, message: `${email} is not a valid email` })


    // validation for password
    if (isEmpty(password)) return res.status(400).send({ status: false, message: "Password is required" })

    // password must be uniqe
    if (!isValidPassword(password)) return res.status(400).send({
      status: false, message: ` Password ${password} length must be between 8 and 15 and must contain mix of unique 
        character @#$%&* and a-z, A-Z` })



    // address should be important

    if (address) {
      if (typeof address != "object") {
        return res
          .status(400)
          .send({ status: false, message: "address only will accept object." });
      }
      if (!address.street) {
        return res
          .status(400)
          .send({ status: false, message: "Street not empty." });
      }
      if (!address.city) {
        return res
          .status(400)
          .send({ status: false, message: "City not empty." });
      }
      if (!address.pincode) {
        return res
          .status(400)
          .send({ status: false, message: "Pincode not empty." });
      }
    }





    //Data Base calls to check valid phone number
    const isUniquePhone = await UserModel.findOne({ phone: phone }).catch(e => null)
    if (isUniquePhone) return res.status(400).send({ status: false, message: `Phone number : ${phone} already registered` })




    // DataBase Calls to check valid email
    const isUniqueEmail = await UserModel.findOne({ email: email }).catch(e => null)
    if (isUniqueEmail) return res.status(400).send({ status: false, message: `Email'': ${email} ''already registered` })


    //User Data creation all
    let userData = { title, name, phone, email, password, address }
    let user = await UserModel.create(userData)


    // new user created
    return res.status(201).send({ status: true, message: "User created sucessfully", data: user })
  }

  // if any error of my this handler
  catch (error) {
    return res.status(500).send({ status: false, message: error.message })
  }
}



// ---------------------for login new user----------------------------------//

const loginUser = async function (req, res) {
  try {
    const loginData = req.body;

    // for valid request in body data in JSON
    if (!isValidRequestBody(loginData)) return res.status(400).send({ status: false, message: "Login request empty" })

    // destracture email and password
    const { email, password } = loginData

    // if email is empty
    if (isEmpty(email)) return res.status(400).send({ status: false, message: "Email is required" })

    //please enter email unique
    if (!isValidEmail(email)) return res.status(400).send({ status: false, message: `${email} is not a valid email` })

    // for password validation
    if (isEmpty(password)) return res.status(400).send({ status: false, message: "please enter a valid password" })

    //DataBase call for checking user is valid user or not valid user
    const user = await UserModel.findOne({ email: email, password: password })
    if (!user) {
      return res.status(401).send({ status: false, message: "Email and Password is not correct" })
    }

    // for token creation
    let token = jwt.sign(
      {
        userId: user._id.toString(),
        batch: "Radon",
        organisation: "FunctionUp",
        exp: Math.floor(Date.now() / 1000) + (600 * 600) // 1 hour 1200s | 2500 (60*10) | (60 * min)
      },
      "functionUp-Radon"
    )

    //sending token in header for response
    res.setHeader("x-api-key", token)

    res.status(200).send({ status: true, data: token })
  }
  catch (error) {
    res.status(500).send({ status: false, message: error.message })
  }
}

module.exports.registerUser = registerUser;
module.exports.loginUser = loginUser;