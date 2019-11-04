const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

app.use(bodyParser.json())
app.use(cors())

morgan.token('body', function(req, res) {
  if (req.method == "POST") {
    return JSON.stringify(req.body);
  }
});

app.use(morgan(':method :status :res[content-length] - :response-time ms :body' ))

app.use(express.static('build'))

let persons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: 1
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: 2
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: 3
  },
  {
    name: "Mary Poppedndieck",
    number: "39-23-6423122",
    id: 4
  }

]

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(person => person.id === id)
  res.json(person)
})

app.put('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  var foundIndex = persons.findIndex(x => x.id === id);
  persons[foundIndex].number = req.body.number;
  res.status(200).end()
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id)
  res.status(204).end()
})


app.post('/api/persons', (req, res) => {

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

  nameAlreadyExist = persons.find(person => person.name === req.body.name)

  if (nameAlreadyExist) {
    return res.status(400).json({
      error: 'name must be unique'
    })
  }

  const person = {
    name: req.body.name,
    number: req.body.number,
    id: generateId()
  }

  persons = persons.concat(person)
  
  res.json(person)
  res.status(201).end()
})

app.get('/info', (req, res) => {
  res.send(`<div>Phonebook has info for ${persons.length} people </div> <p> ${Date(Date.now()).toString()}</p>`)
})

const generateId = () => {
  const id = Math.floor(Math.random() * 1000) + 1
  return id
}


const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
})
