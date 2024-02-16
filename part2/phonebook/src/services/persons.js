import axios from 'axios'
const baseUrl = 'http://localhost:3001/persons'


const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

const addPerson = newPerson => {
    const request = axios.post(baseUrl, newPerson)
    return request.then(response => response.data)
}

const deletePerson = (id) => {
    return axios.delete(`${baseUrl}/${id}`)
  }

const updatePhone = (id, newPhone) => {
    return axios.put(`${baseUrl}/${id}`, newPhone)
}

export default {getAll, addPerson, deletePerson, updatePhone}