const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]

const url =
    `mongodb+srv://fullstack:${password}@fullstackopencluster-2qzax.azure.mongodb.net/phonebook-app?retryWrites=true&w=majority`

mongoose.connect(url, { useUnifiedTopology: true, useNewUrlParser: true })

const phonebookSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', phonebookSchema)


if (process.argv.length === 3) {
    Person.find({}).then(result => {
        console.log("phonebook:") 
        result.forEach(person => {
            console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
    })
}

if (process.argv.length === 5) {
    const person = new Person({
        name: process.argv[3],
        number: process.argv[4]
    })    
    person.save().then(response => {
        console.log(`added ${person.name} ${person.number} to phonebook`)
        mongoose.connection.close()
    })
    .catch(error =>
        console.log(error)
    )
}



