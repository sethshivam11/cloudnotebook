const mongoose = require('mongoose');
const dotenv = require('dotenv').config();

console.log(process.env.MONGODB_URI);

const connectToDb = async () => {
        await mongoose
          .connect(process.env.MONGODB_URI , {
            useNewUrlParser: true,
            useUnifiedTopology: true
          })
          .then(() => console.log("Successfully Connected to Database!"));
}
module.exports = connectToDb;