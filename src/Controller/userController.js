const UserModel = require("../Modules/UserModel");


const registerUser = async (req, res) => {
      try {
          const data = req.body;
      //     console.log(data)
      //   let userData = { tittle,name, phone, email, password, address }
        let user = await UserModel.create(data)
      //   console.log(user)
        return res.status(201).send({ status: true, message: "User created sucessfully", data: user })

      }
      
      catch (error) {
          return res.status(500).send({ status: false, message: error.message })
      }
  }

  
  
  module.exports.registerUser=registerUser