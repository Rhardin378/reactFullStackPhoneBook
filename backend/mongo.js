const mongoose = require('mongoose')

if (process.argv.length<3) {
	console.log('give password as argument')
	process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://rhardin378:${password}@cluster0.in7hm2d.mongodb.net/PhoneBook?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const contactSchema = new mongoose.Schema({
	name: String,
	number: Number
})

const Contact = mongoose.model('Contact', contactSchema)

const contact = new Contact({
	name: process.argv[3],
	number: process.argv[4]
})

if (process.argv.length < 4) {
	Contact.find({}).then(result => {
		result.forEach(contact => {
			console.log(`${contact.name} ${contact.number}`)
		})
		mongoose.connection.close()
	})
}
else {
	contact.save().then(result => {
		console.log(`added ${result.name} number ${result.number} to phonebook`)
	})
}
