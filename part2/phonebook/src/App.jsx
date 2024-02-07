import { useState, useEffect } from 'react'
import axios from 'axios'

const Person = ({name, number}) => <p>{name} {number}</p>

const Filter = ({value, handleClick}) => <div>filter shown with <input value={value} onChange={handleClick}/></div>

const PersonForm = ({newName, newPhone, handleNameChange, handlePhoneChange, addPerson}) => 
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

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [filter, setFilter] = useState('')

  useEffect(() => {
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        setPersons(response.data)
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
    const isNamePresent = persons.some(person => person.name === newName)

    if (isNamePresent)
    {
      alert(`${newName} is already added to the phonebook`)
      setNewName('')
    }
    else if (newName === '' || newPhone === '')
    {
      alert('Cannot add an empty value to the phonebook')
    }
    else 
    {
      const len = persons.length + 1
      const person = {name: newName, number: newPhone, id: {len}}
      setPersons(persons.concat(person))
      setNewName('')
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
          <Person name={person.name} number={person.number} key={person.name} />
          )}
      </div>
    </div>
  )
}

export default App