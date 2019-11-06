const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(bodyParser.json())
app.use(cors())

morgan.token('body', function(req, res) {
  if (req.method == "POST") {
    return JSON.stringify(req.body);
  }
});


app.use(morgan(':method :status :res[content-length] - :response-time ms :body' ))

app.use(express.static('build'))


app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons.map(person => person.toJSON()))
  })
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person.toJSON())
      } else {
        res.status(404).end() 
      }
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body

  const person = {
    number: body.number,
  }

  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then(updatedPerson => {
      res.json(updatedPerson.toJSON())
      res.status(200).end()
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res,next) => {
  Person.findByIdAndRemove(req.params.id)
  .then(() => {
    res.status(204).end()
  })
  .catch(error => next(error))
})


app.post('/api/persons', (req, res, next) => {

  if (!req.body.name) {
    return res.status(400).json({
      error: 'name is missing'
    })
  }

  if (!req.body.number) {
    return res.status(400).json({
      error: 'number is missing'
    })
  }

  const person = new Person({
    name: req.body.name,
    number: req.body.number
  })

  person.save().then(savedPerson => {
    res.json(savedPerson.toJSON())
    res.status(201).end()
  })
  .catch(error => next(error))
})

app.get('/info', (req, res) => {
  Person.find({}).then(persons => {
    res.send(`<div>Phonebook has info for ${persons.length} people </div> <p> ${Date(Date.now()).toString()}</p>`)
  })
  
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' })
  } 
  else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

app.use(errorHandler)



const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
})
