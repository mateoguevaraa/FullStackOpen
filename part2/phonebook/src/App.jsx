import { useState, useEffect } from 'react'
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

const NotificationSuccess = ({ message }) => {
  const notificationStyle = {
    color: 'green',
    background: 'lightgrey',
    fontSize: '20',
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }

  if (message === null) {
    return null
  }

  return (
    <div className="error" style={notificationStyle}>
      {message}
    </div>
  )
}

const NotificationError = ({ message }) => {
  const notificationStyle = {
    color: 'red',
    background: 'lightgrey',
    fontSize: '20',
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }

  if (message === null) {
    return null
  }

  return (
    <div className="error" style={notificationStyle}>
      {message}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [filter, setFilter] = useState('')
  const [successMessage, setSuccessMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

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
        .then(response => {
          setPersons(persons.map(person => person.id !== id ? person : response.data))
          setSuccessMessage(`${newName} phone updated successfuly!`)
          setTimeout(() => {
            setSuccessMessage(null)},
            5000)
          }
        )
        .catch((error, repeatedPerson) => {
          console.log('error');
          setErrorMessage(`The information of ${newName} has already been removed from server.`)
          setTimeout(() => {
            setErrorMessage(null)},
            5000)
        })
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
      const lastId = persons.length === 0? 0 : parseInt(persons[persons.length - 1].id) 
      const id = (lastId + 1).toString()
      const NewPerson = {name: newName, number: newPhone, id}

      personsService
      .addPerson(NewPerson)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setSuccessMessage(`${newName} added succesfully!`)
        setTimeout(() => {
          setSuccessMessage(null)},
          5000)
        setNewName('')
        setNewPhone('')
      })
    }
  }

  const handleDeletePerson = (person) => {
    if (window.confirm(`Delete ${person.name}?`)) {
      personsService
        .deletePerson(person.id)
        .then(() => {
          return personsService.getAll()
        })
        .then((returnedPersons) => {
          setPersons(returnedPersons);
          setSuccessMessage(`${person.name} deleted successfully!`);
          setTimeout(() => {
            setSuccessMessage(null);
          }, 5000);
        })
        .catch((error) => {
            console.log('error');
            setErrorMessage(`The information of ${person.name} has already been removed.`);
        })
    }
  };
  
  

  return (
    <div>
      <h2>Phonebook</h2>
      <NotificationSuccess message={successMessage} />
      <NotificationError message={errorMessage} />
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