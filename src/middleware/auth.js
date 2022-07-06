// //Validations

// if (isEmpty(title)) return res.status(400).send({ status: false, message: "Title is required" })

// if (['Mr', 'Mrs', 'Miss'].indexOf(title) == -1) return res.status(400).send({ status: false, message: "Title must be Mr, Mrs, Miss" })

// if (isEmpty(name)) return res.status(400).send({ status: false, message: "User name is required" })

// if (!name.match(/^[#.a-zA-Z\s,-]+$/)) return res.status(400).send({ status: false, message: "User name is Invalid !" })

// if (isEmpty(phone)) return res.status(400).send({ status: false, message: "Phone Number is required" })

// if (!isValidPhone(phone)) return res.status(400).send({ status: false, message: `${phone} is not a valid phone number` })

// if (isEmpty(email)) return res.status(400).send({ status: false, message: "Email is required" })

// if (!isValidEmail(email)) return res.status(400).send({ status: false, message: `${email} is not a valid email` })

// if (isEmpty(password)) return res.status(400).send({ status: false, message: "Password is required" })
// if (!isValidPassword(password)) return res.status(400).send({ status: false, message: ` Password ${password} length must be between 8 and 15 and must contain mix of unique character @#$%&* and a-z, A-Z` })

// //DB calls to check valid phone and email
// const isUniquePhone = await UserModel.findOne({ phone: phone }).catch(e => null)

// if (isUniquePhone) return res.status(400).send({ status: false, message: `Phone number : ${phone} already registered` })

// const isUniqueEmail = await UserModel.findOne({ email: email }).catch(e => null)

// if (isUniqueEmail) return res.status(400).send({ status: false, message: `Email : ${email} already registered` })

// //User creation
// let userData = { title, name, phone, email, password, address }
// let user = await UserModel.create(userData)



// return res.status(201).send({ status: true, message: "User created sucessfully", data: user })