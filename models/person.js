const mongoose = require('mongoose')

const url =
    `mongodb+srv://fullstack:@fullstackopencluster-2qzax.azure.mongodb.net/phonebook-app?retryWrites=true&w=majority`

mongoose.connect(url, { useUnifiedTopology: true, useNewUrlParser: true })
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    })

const phonebookSchema = new mongoose.Schema({
    name: String,
    number: String
})

module.exports = mongoose.model('Person', phonebookSchema)