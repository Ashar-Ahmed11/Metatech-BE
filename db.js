const mongoose = require('mongoose')

const URI = 'mongodb+srv://ashar2day:karachi2020@cluster0.drsj4wm.mongodb.net/metatech'

mongoose.set("strictQuery", false);
const connectToMongo = () => mongoose.connect(URI, () => {
    console.log("Connected to Mongo Successfully")
})

module.exports = connectToMongo