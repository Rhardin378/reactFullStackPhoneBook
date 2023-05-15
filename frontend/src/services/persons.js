import axios from 'axios'
const baseUrl = '/api/contacts'

const getAll = () => {
  const request = axios.get(`${baseUrl}/`)
  return request.then(response => response.data)
}

const create = newObject => {
  const request = axios.post(baseUrl, newObject)
  return request.then(response => response.data)
}

const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/contacts/${id}`, newObject)
  return request.then(response => response.data)
}

const remove = (id) => {
  const deletedPerson = `${baseUrl}/contacts/${id}`
 return axios.delete(deletedPerson)
}


export default { getAll, create, update, remove }