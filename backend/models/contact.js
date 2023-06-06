
require('dotenv').config()
const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.set('strictQuery', false)

mongoose.connect(url)
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    })


const contactSchema = new mongoose.Schema({
    name: String,
    number: Number,
  })
  
  //Even though the _id property of Mongoose objects looks like a string, it is in fact an object. THE toJSON METHOD OF THE SCHEMA IS USED ON ALL INSTANCES OF THE MODELS PRODUCED WITH THAT SCHEMA The toJSON method we defined transforms it into a string just to be safe. If we didn't make this change, it would cause more harm to us in the future once we start writing tests.
  
  contactSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })
  
  module.exports = mongoose.model('Contact', contactSchema)
