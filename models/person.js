const mongoose = require('mongoose')
var uniqueValidator = require('mongoose-unique-validator');

const url =
    `mongodb+srv://fullstack:123qwe@fullstackopencluster-2qzax.azure.mongodb.net/phonebook-app?retryWrites=true&w=majority`

mongoose.connect(url, { useUnifiedTopology: true, useNewUrlParser: true })
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    })

const phonebookSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true, minlength: 3 },
    number: { type: String,  minlength: 8 }
})

phonebookSchema.plugin(uniqueValidator)

phonebookSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

module.exports = mongoose.model('Person', phonebookSchema)