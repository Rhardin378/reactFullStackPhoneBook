const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')

app.use(cors())
app.use(express.json())
app.use(morgan('tiny'))

const contacts = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }, 
    { 
      "id": 5,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]


app.get('/api/contacts', (request, response)=>{
    response.json(contacts)
})

app.get('/api/contacts/info', (request, response)=>{
    const currentDate = new Date()
    const contactsLength = contacts.length

    response.send(`<p>You currently have ${contactsLength} people in your phonebook <br> ${currentDate}</p>`)
})
app.get('/api/contacts/:id', (request, response) => {
    const id = Number(request.params.id)
    const contact = contacts.find(contact => contact.id === id) 
    if (contact) {
        response.json(contact)
    } else {
        response.status(404).end()
    }
})


const generateId = () => {
    const randomId = Math.ceil(Math.random()* 95726904 + 1)
    return randomId
    }

app.post('/api/contacts/', (request, response)=>{
    const body = request.body
    const alreadyAddedContact = contacts.find(contact => contact.name === body.name)
    if (!body.name) {
        return response.status(404).json({
            error: "name missing"
        })
    }
    else if (!body.number) {
        return response.status(404).json({
            error: "number missing"
        })
    }
    else if (alreadyAddedContact) {
        return response.status(404).json({
            error: "name already exists"
        })
    }
    
    const contact = {
        id: generateId(),
        name: body.name,
        number: body.number
    }

    const phoneBook = contacts.concat(contact)

    response.json(phoneBook)

})

app.delete('/api/contacts/:id', (request, response)=>{
    const id = Number(request.params.id)
    const contact = contacts.filter(contact => contact.id === id)
    console.log(contact[0].name, 'has been deleted')
    response.status(204).end()
})





const PORT = 9000
app.listen(PORT, ()=>{
    console.log(`server is listening on port ${PORT}`)
})