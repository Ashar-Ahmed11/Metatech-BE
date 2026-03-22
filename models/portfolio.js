const mongoose = require('mongoose')
const { Schema } = mongoose

const portfolioSchema = new Schema({
  title: {
    type: String,
  },
  description: {
    type: String,
  },
   websiteUrl: { type: String },
  images: [
    {
      url: {
        type: String,
      }
    }
  ],
  date: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('portfolio', portfolioSchema)