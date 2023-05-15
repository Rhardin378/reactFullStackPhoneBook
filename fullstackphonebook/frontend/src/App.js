import { useState, useEffect } from 'react'
import personsService from './services/persons'


const Filter = (props) => {
  return (
    <div>
    <label>Filter Name:</label> <input name="filter" value={props.value} onChange={props.handlChange} />
    </div>
  )
}

const PersonForm = (props) => {
  return (
    <form>
    <div>
      name: <input value={props.newName} onChange={props.handleNameChange} />
      number: <input value={props.newNumber} onChange={props.handleNumberChange} />
    </div>
    <div>
      <button onClick={props.addPerson}>add</button>
    </div>
  </form>
  )
  }

  const ContactList = (props) => {

      
  return (
      <ul>
      {props.filteredContacts.map(person=>
      <li key={person.name}>
        {person.name} {person.number} 
        <button onClick={()=>props.deleteContact(person.id, person.name)}>Delete</button>
          </li>)}
      </ul>
  
    )
  }
  const Notification = ({ message, messageState }) => {
   
    
    if (message === null) {
      return null
    }
  
    return (
      <div className={messageState}>
        {message}
      </div>
    )
  }
  

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filteredName, setFilteredName] = useState('')
  const [successMessage, setSuccessMessage] = useState(null)
  const [messageState, setMessageState] = useState('success')

  const messageStyle = messageState === 'success' ? 'success' : 'error'

  useEffect(() => {
     personsService.getAll()
     .then(initialPersons => {
      setPersons(initialPersons)
     })
    }, [])

  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const filterEntry = (event) => {
    console.log(event.target.value)
    setFilteredName(event.target.value)
      

  }

  const foundEntry = persons.filter(person=> person.name.toLowerCase().includes(filteredName.toLowerCase()))
  console.log('found entry',foundEntry)
  
  const addPerson = (event) => {
    // if person exists in phonebook  dont add entry alert entry already exists
    event.preventDefault()
    
    const phoneBookEntry = {
        name: newName,
        number: newNumber
    }
    
    const personExists = persons.some(person=> person.name === newName)
    
    
    if(personExists){
        // add a number.... if the user already exists update the number 
    function findNumber(person){
      return person.name === newName
    }

    //search for an existing person with the number === new number
    const numberToUpdate = persons.find(findNumber)
    //object used to pass an updated number 
    const updatedNumber = {
      // spread the number to update and the updated number as a new object
      ...numberToUpdate, number: newNumber
    }
    const confirmNumberUpdate = confirm(`${newName} is alreaddy added to the phonebook.  would you like to update the current number?`)
    
    if(confirmNumberUpdate) {
      //if the person chooses to replace the number send a put request to the person with the id of the person to be updated
      personsService.update(numberToUpdate.id, updatedNumber)
      .then(returnedNumber=>{
        console.log(returnedNumber)
        // set the state after making the put request map over the persons array if the id is not the id of the updated number return the old person object if the id is === return the updated value instead of the old value in this case we replace returnedNumber (the object that was updated in the put request) with the old number object 
        setPersons(persons.map(person => person.id !== returnedNumber.id ? person : returnedNumber))


      })
      setNewName('')
      setNewNumber('')
      }

      console.log('persons', persons)
      console.log(`ready to update ${numberToUpdate.name}`)
    
    } else if (newName === '') {
      alert('please enter a name')
    }
    else {
    personsService.create(phoneBookEntry).then(returnedPersons => {
      setPersons(persons.concat(returnedPersons))
      setSuccessMessage(`${returnedPersons.name} has been added to the phonebook`)
      setTimeout(()=>{
        setSuccessMessage(null)
      }, 5000)
      setNewName('')
      setNewNumber('')
    })
    }
    }

    const deleteEntry = (id, EntryName) => {
      console.log(`person to be deleted ${EntryName}`)
      const confirmDelete = confirm('would you like to delete this entry?')
      console.log('entry to be deleted', EntryName)

      if (confirmDelete){
         const newPersonState= persons.filter(person => person.id !== id)
  
        personsService.remove(id).then(()=>{
          setMessageState('error')
          setSuccessMessage(`${EntryName} has been Deleted`)
          setPersons(newPersonState)
        }).catch(error =>{
          setMessageState('error')
          setSuccessMessage(`${EntryName} has already been removed from the server`)
          setTimeout(()=>{
            setSuccessMessage(null)
          }, 5000)
          setPersons(newPersonState)
        })
      }
    }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={successMessage}
                    messageState={messageStyle}/>
      <Filter value={filteredName} handlChange={filterEntry} />
      <h3>Add a new</h3>
      <PersonForm newName={newName} 
      handleNameChange={handleNameChange} 
      newNumber={newNumber} 
      handleNumberChange={handleNumberChange} 
      addPerson={addPerson} />
      <h2>Numbers</h2>
  <ContactList filteredContacts={foundEntry} deleteContact={deleteEntry}
 />
    </div>
  )

}

export default App