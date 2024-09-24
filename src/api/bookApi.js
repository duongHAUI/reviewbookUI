import axiosClient from './axiosClient'
import baseApi from './baseApi'

export class bookApi extends baseApi {
  searchBook = (params) => {
    try {
      return axiosClient.post(this.baseUrl + 'SearchBook', params)
    } catch (error) {
      console.log(error)
    }
  }
  getBookDetail = (params) => {
    try {
      return axiosClient.post(this.baseUrl + 'get-book-detail', params)
    } catch (error) {
      console.log(error)
    }
  }
  UpdateStatusRead = (param) => {
    try {
      return axiosClient.put('Book/update-status-read', param)
    } catch (error) {
      console.log(error)
    }
  }
  UserReviewStartBook = (param) => {
    try {
      return axiosClient.post('Book/UserReviewStartBook', param)
    } catch (error) {
      console.log(error)
    }
  }
}

export default bookApi
