import axios from 'axios'
const baseUrl = 'http://localhost:3005'

const getAll = () => {
  const request = axios.get(`${baseUrl}/contacts`)
  return request.then(response => response.data)
}

const create = newObject => {
  const request = axios.post(baseUrl, newObject)
  return request.then(response => response.data)
}

const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  return request.then(response => response.data)
}

const remove = (id) => {
  const deletedPerson = `http://localhost:9000/api/persons/${id}`
 return axios.delete(deletedPerson)
}


export default { getAll, create, update, remove }