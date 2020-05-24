import axios from 'axios'

const api = axios.create({ baseURL: 'http://192.168.25.11:3009/api'})

export default api;