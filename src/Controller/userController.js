const UserModel = require("../Modules/UserModel");

//-----------------------imort validation function from validation.js------------------
const { isValidRequestBody, isEmpty, isValidPhone, isValidEmail, isValidPassword } = require("../utility/validation.js")
const jwt = require('jsonwebtoken');

// ----------------------------for ragisterUser------------------------
const registerUser = async (req, res) => {
    try {
        const data = req.body;

        if (!isValidRequestBody(data)) return res.status(400).send({ status: false, message: "User credentials are required" })

        let { tittle, name, phone, email, password, address } = data

        //Validations for tittle
        if (isEmpty(tittle)) return res.status(400).send({ status: false, message: "Title is required" })
        if (['Mr', 'Mrs', 'Miss'].indexOf(tittle) == -1) return res.status(400).send({ status: false, message: "Title must be Mr, Mrs, Miss" })

      // validation for name
        if (isEmpty(name)) return res.status(400).send({ status: false, message: "User name is required" })
        
        if (!name.match(/^[#.a-zA-Z\s,-]+$/)) return res.status(400).send({ status: false, message: "User name is Invalid !" })

      // validation for phonenumber
        if (isEmpty(phone)) return res.status(400).send({ status: false, message: "Phone Number is required" })
        
        if (!isValidPhone(phone)) return res.status(400).send({ status: false, message: `${phone} is not a valid phone number` })


      // validation for email
        if (isEmpty(email)) return res.status(400).send({ status: false, message: "Email is required" })

        if (!isValidEmail(email)) return res.status(400).send({ status: false, message: `${email} is not a valid email` })


      // validation for password
        if (isEmpty(password)) return res.status(400).send({ status: false, message: "Password is required" })
        if (!isValidPassword(password)) return res.status(400).send({ status: false, message: ` Password ${password} length must be between 8 and 15 and must contain mix of unique character @#$%&* and a-z, A-Z` })

        //Data Base calls to check valid phone number
        const isUniquePhone = await UserModel.findOne({ phone: phone }).catch(e => null)
        if (isUniquePhone) return res.status(400).send({ status: false, message: `Phone number : ${phone} already registered` })

      // DataBase Calls to check valid email
        const isUniqueEmail = await UserModel.findOne({ email: email }).catch(e => null)
        if (isUniqueEmail) return res.status(400).send({ status: false, message: `Email : ${email} already registered` })

        //User Data creation all
        let userData = { tittle, name, phone, email, password, address }
        let user = await UserModel.create(userData)

            

        return res.status(201).send({ status: true, message: "User created sucessfully", data: user })
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

// ---------------------for login user----------------------------------

const loginUser = async function (req, res) {
    try {
        const loginData = req.body;

      // for valid requestbody
        if (!isValidRequestBody(loginData)) return res.status(400).send({ status: false, message: "Login Credentials cannot be empty" })

      // validation for email and password
        const { email, password } = loginData

      // if email is empty 
        if (isEmpty(email)) return res.status(400).send({ status: false, message: "Email is required" })

      //   for email validation
        if (!isValidEmail(email)) return res.status(400).send({ status: false, message: `${email} is not a valid email` })

      // for password validation
        if (isEmpty(password)) return res.status(400).send({ status: false, message: "Password is required" })

        //DataBase call for checking user is valid user or not
        const user = await UserModel.findOne({ email: email, password: password })
        if (!user) {
            return res.status(401).send({ status: false, message: "Email or Password is not correct" })
        }

        let token = jwt.sign(
            {
                userId: user._id.toString(),
                batch: "Radon",
                organisation: "FunctionUp",
                exp: Math.floor(Date.now() / 1000) + (60 * 60) // 1 hour 1200s | 2500 (60*10) | (60 * min)
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

module.exports.registerUser=registerUser;
module.exports.loginUser=loginUser;