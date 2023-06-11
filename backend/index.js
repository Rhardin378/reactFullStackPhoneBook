require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')

const Contact = (require('./models/contact'))


app.use(express.static('build'))
app.use(cors())
app.use(express.json())
app.use(morgan('tiny'))

app.get('/api/contacts', (request, response) => {
	Contact.find({}).then(contacts => {
		response.json(contacts)
	}).catch(error => console.error(error.message))
})

app.get('/api/contacts/info', (request, response) => {
	const currentDate = new Date()
	Contact.find({}).then(contacts => (
		response.send(`<p>You currently have ${contacts.length} people in your phonebook <br> ${currentDate}</p>`)
	))


})

app.get('/api/contacts/:id', (request, response, next) => {
	Contact.findById(request.params.id)
		.then(contact => {
			if (contact) {
				response.json(contact)
			} else {
				response.status(404).end()
			}
		})
		.catch(error => next(error))
})
// code that was being used to find the id without a backend hooked up yet
// const id = Number(request.params.id)
// const contact = contacts.find(contact => contact.id === id)
// if (contact) {
//     response.json(contact)
// } else {
//     response.status(404).end()
// }



// const generateId = () => {
//     const randomId = Math.ceil(Math.random()* 95726904 + 1)
//     return randomId
//     }

app.post('/api/contacts/', (request, response, next) => {
	const body = request.body
	const contact = new Contact({
		name: body.name,
		number: body.number
	})

	contact.save().then(savedContact => {
		console.log(`${savedContact.name} has been saved to the database`)
		response.json(savedContact)
	}).catch(error => next(error))

	// const phoneBook = contacts.concat(contact)

})

app.put('/api/contacts/:id', (request, response, next) => {
	const body = request.body

	const contact = {
		name: body.name,
		number: body.number
	}

	Contact.findByIdAndUpdate(request.params.id, contact, { new: true }).then(updatedContact => {
		response.json(updatedContact)
	})
		.catch(error => next(error))
})

app.delete('/api/contacts/:id', (request, response, next) => {
	Contact.findByIdAndRemove(request.params.id)
		.then(result => {
			console.log(result)
			response.status(204).end()
		})
		.catch(error => next(error))

	// const id = Number(request.params.id)
	// const contact = contacts.filter(contact => contact.id === id)
	// console.log(contact[0].name, 'has been deleted')
	// response.status(204).end()
})



const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
	console.error(error.message)
	console.log(error.message)

	if (error.name === 'CastError') {
		return response.status(400).send({ error: 'malformatted id' })
	} else if (error.name === 'ValidationError') {
		return response.status(400).json({ error: error.message })
	}


	next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 9000

app.listen(PORT, () => {
	console.log(`server is listening on port ${PORT}`)
})