import axiosClient from './axiosClient'
import baseApi from './baseApi'
export class reviewPostApi extends baseApi {
  getReviewPost = (params) => {
    try {
      return axiosClient.post(this.baseUrl + 'GetReviewPost', params)
    } catch (error) {
      console.log(error)
    }
  }
}

export default reviewPostApi
