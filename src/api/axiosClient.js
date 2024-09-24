import router from '@/router'
import axios from 'axios'
import queryString from 'query-string'
// import router from '@/router/index'

/**
 * Config axios
 */
const axiosClient = axios.create({
  baseURL: 'https://localhost:7078/api/v1',
  headers: {
    'content-type': 'application/json'
  },
  paramsSerializer: {
    encode: queryString.parse,
    serialize: (params) => queryString.stringify(params)
  }
})

// Xử lý token
axiosClient.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

/**
 * Config response
 */
axiosClient.interceptors.response.use(
  (response) => {
    if (response && response.data) {
      return response.data
    }
    return response
  },
  (error) => {
    console.log('Lỗi', error)
    // Xử lý các lỗi của response
    if (error.response) {
      // Xử lý các lỗi từ phía server
      if (error.response.status === 401) {
        router.push('/login')
        localStorage.removeItem('user')
      }
    }

    return Promise.reject(error)
    // throw error;
  }
)

export default axiosClient
