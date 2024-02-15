import { useState, useEffect } from 'react'
import axios from 'axios'
import personsService from './services/persons'

const Person = ({name, number, handleClick}) => 
<>
  <p>
    {name} {`${number} `}
    <button onClick={handleClick}>delete</button>
  </p>
</>

const Filter = ({value, handleClick}) => <div>filter shown with <input value={value} onChange={handleClick}/></div>

const PersonForm = ({newName, newPhone, handleNameChange, handlePhoneChange, addPerson}) =>
<> 
<form onSubmit={addPerson}>
  <div>
    name: <input value={newName} onChange={handleNameChange}/>
  </div>
  <div>
    number: <input value={newPhone} onChange={handlePhoneChange}/>
  </div>
  <div>
    <button type="submit">add</button>
  </div>
</form>
</>

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [filter, setFilter] = useState('')

  useEffect(() => {
    personsService
    .getAll()
    .then(initialPersons => {
      setPersons(initialPersons)
    })
  }, [])


  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handlePhoneChange = (event) => {
    setNewPhone(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const filterShow = filter === '' ? persons : persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))

  const addPerson = (event) => {
    event.preventDefault()
    console.log(newName)
    const isNamePresent = persons.some(person => person.name === newName)

    if (isNamePresent)
    {
      if(window.confirm(`${newName} is already added to the phonebook, replace the old number with a new one?`))
      {
        const repeatedPersonArray = persons.filter(person => person.name === newName)
        const repeatedPerson = repeatedPersonArray[0]
        console.log(repeatedPerson)
        const id = repeatedPerson.id
        const updatedPerson = {...repeatedPerson, number: newPhone}
        console.log(updatedPerson)
        personsService
        .updatePhone(id, updatedPerson)
        .then(response =>
          setPersons(persons.map(person => person.id !== id ? person : response.data)))
      }
      else
      {
        setNewName('')
        setNewPhone('')
      }
    }
    else if (newName === '' || newPhone === '')
    {
      alert('Cannot add an empty value to the phonebook')
    }
    else 
    {
      const lastId = parseInt(persons[persons.length - 1].id) 
      const id = (lastId + 1).toString()
      const NewPerson = {name: newName, number: newPhone, id}

      personsService
      .addPerson(NewPerson)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewPhone('')
      })
    }
  }

  const handleDeletePerson = (person) => {
    if (window.confirm(`Delete ${person.name}?`)) {
      personsService
      .deletePerson(person.id)
      .then(() => personsService.getAll())
      .then(returnedPersons =>
        setPersons(returnedPersons))
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter value={filter} handleClick={handleFilterChange} />
      <h2>Add a new</h2>
      <PersonForm newName={newName} newPhone={newPhone} handleNameChange={handleNameChange} handlePhoneChange={handlePhoneChange} addPerson={addPerson}/>
      <h2>Numbers</h2>
      <div>
        {filterShow.map(person =>
          <Person name={person.name} number={person.number} handleClick={() => handleDeletePerson(person)} key={person.name} />
          )}
      </div>
    </div>
  )
}

export default App