const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const route = require("./src/routes/route.js");
const app = express();
const port = 3002;


app.use(bodyParser.json());

// ----------------------mongoose method for connection btwn atlast to  cluster
mongoose
  .connect(
    "mongodb+srv://21pintoo-singh:S0Uw8LhNlYRyHfiq@cluster1.k5nsu.mongodb.net/group46Database", {
      useNewUrlParser: true,
    }
  )
  .then(() => console.log("MongoDb is connected"))
  .catch((err) => console.log(err));

app.use("/", route);

app.listen(port, () => {
  console.log(`Fire on port ${port}`);
});