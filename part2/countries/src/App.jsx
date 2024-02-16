import { useState, useEffect } from 'react'
import axios from 'axios'

const Message = ({text}) => {
  return (
    <>
    <p>{text}</p>
    </>
  )
}

const CountryName = ({name}) => {
  return (
    <>
    <p>{name}</p>
    </>
  )
}

const CountryInfo = ({country}) => {
  if (country) {
    const languages = Object.values(country.languages)
    return (
      <>
      <h1><strong>{country.name.common}</strong></h1>
      <p>capital {country.capital}</p>
      <p>area {country.area}</p>
      <p><strong>languages</strong></p>
      <ul>
        {languages.map(language => <li key={language}>{language}</li>)}
      </ul>
      <img src={country.flags.png} alt={`Flag of ${country.name.common}`}/>
      </>
    )
  }
}

const App = () => {
  const [countryInput, setCountryInput] = useState(null)
  const [countryList, setCountryList] = useState([])
  const [message, setMessage] = useState('')
  const [country, setCountry] = useState(null)

  const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api'

  useEffect(() => {
    if (countryInput) {
      axios.get(`${baseUrl}/all`)
      .then(response => {
        const filteredCountries = response.data.filter(country =>
          country.name.common.toLowerCase().includes(countryInput.toLowerCase())
      )
        setCountryList(filteredCountries)

        if (filteredCountries.length > 10) {
          setMessage('Too many matches, specify another filter')
          setCountry(null)
          setCountryList([])
        } else if (filteredCountries.length === 0) {
          setMessage('No country found')
          setCountry(null)
        } else if (filteredCountries.length === 1){
          setCountry(filteredCountries[0])
          setMessage('')
          setCountryList([])
        } else {
          setMessage('')
          setCountry(null)
        }
      })
    }
  }, [countryInput])


  const handleCountryChange = (event) => {
    setCountryInput(event.target.value)
  }

  return (
    <>
      <div>
        find countries<input onChange={handleCountryChange}></input>
      </div>
      <div>
        {  
          countryList.map(country => <CountryName name={country.name.common} key={country.name.common} />)
        }
        <Message text={message} />
        <CountryInfo country={country} key={country ? country.name.common : null}/>
      </div>
    </>
  )
}

export default App
