import { useState, useEffect } from 'react'
import axios from 'axios'

const api_key = import.meta.env.VITE_SOME_KEY

const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api'
const baseWeatherUrl = 'https://api.openweathermap.org/data/2.5/weather?q='

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

const Button = ({text, handleClick}) => {
  return (
    <><button onClick={handleClick}>{text}</button></>
  )
}

const CountryInfo = ({ country }) => {
  const [weatherInfo, setWeatherInfo] = useState(null);

  useEffect(() => {
    if (country) {
      axios
        .get(`${baseWeatherUrl}${country.capital}&appid=${api_key}&units=metric`)
        .then((response) => {
          setWeatherInfo(response.data);
        })
        .catch((error) => {
          console.error('Error fetching weather data:', error);
        });
    }
  }, [country]);

  if (!country) return null;
  return (
    <>
      <h1><strong>{country.name.common}</strong></h1>
      <p>capital {country.capital}</p>
      <p>area {country.area}</p>
      <p><strong>languages</strong></p>
      <ul>
        {Object.values(country.languages).map((language, index) => (
          <li key={index}>{language}</li>
        ))}
      </ul>
      <img src={country.flags.png} alt={country.flags.alt} />
      <h2>{`Weather in ${country.capital}`}</h2>
      {weatherInfo && (
        <>
          <p>temperature {weatherInfo.main.temp} Celsius</p>
          <img src={`https://openweathermap.org/img/wn/${weatherInfo.weather[0].icon}.png`} alt={weatherInfo.weather[0].description} />
          <p>wind {weatherInfo.wind.speed} m/s</p>
        </>
      )}
    </>
  );
};


const App = () => {
  const [countryInput, setCountryInput] = useState(null)
  const [countryList, setCountryList] = useState([])
  const [message, setMessage] = useState('')
  const [country, setCountry] = useState(null)


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

  const handleShow = (CountryName) => {
    axios.get(`${baseUrl}/name/${CountryName}`)
    .then(response => {
      setCountry(response.data)
      setCountryList([])
      setCountryInput(null)
    })
  }

  return (
    <>
      <div>
        find countries<input onChange={handleCountryChange}></input>
      </div>

        {  
          countryList.map((country) =>
          <div key={country.name.common} style={{ display: 'flex', alignItems: 'center', marginBottom: 5 }}>
          <CountryName name={country.name.common} key={country.name.common} />
          <Button text='show' handleClick={() => handleShow(country.name.common)} />
          </div>)
        }
        <Message text={message} />
        <CountryInfo country={country} key={country ? country.name.common : null}/>
    </>
  )
}

export default App
