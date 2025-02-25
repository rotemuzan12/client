import axios from 'axios'

// 1. Set base URL if your backend runs at http://localhost:8080
axios.defaults.baseURL = 'http://localhost:8080'

// 2. Attach JWT token if present
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default axios
