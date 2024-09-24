import msEnum from './enum'
import resources from './resource'
import constants from './constants'

msEnum
const common = {
  formatPrice(price) {
    if (!price) return ''
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  },
  getColor(enumColor) {
    switch (enumColor) {
      case msEnum.enumColor.red:
        return 'red'
      case msEnum.enumColor.blue:
        return 'blue'
      case msEnum.enumColor.white:
        return 'white'
    }
  },
  /**
   * Format date (DD/MM/YYYY)
   */
  formatDate(dateTime) {
    try {
      if (dateTime) {
        dateTime = new Date(dateTime)
        let date = dateTime.getDate() < 10 ? '0' + dateTime.getDate() : dateTime.getDate()
        let month =
          dateTime.getMonth() < 9 ? `0${dateTime.getMonth() + 1}` : dateTime.getMonth() + 1
        let year = dateTime.getFullYear()
        return `${date}/${month}/${year}`
      }
      return ''
    } catch (error) {
      return ''
    }
  },
  timeAgo(time) {
    const now = new Date()
    const postedDate = new Date(time)
    const diffInSeconds = Math.floor((now - postedDate) / 1000)

    const minutes = Math.floor(diffInSeconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)
    const weeks = Math.floor(days / 7)
    const months = Math.floor(days / 30)
    const years = Math.floor(days / 365)

    if (years > 0) return `${years} năm trước`
    if (months > 0) return `${months} tháng trước`
    if (weeks > 0) return `${weeks} tuần trước`
    if (days > 0) return `${days} ngày trước`
    if (hours > 0) return `${hours} giờ trước`
    if (minutes > 0) return `${minutes} phút trước`
    return `vài giây trước`
  },
  getTitleStatusOrder(status) {
    switch (status) {
      case msEnum.enumStatusOrder.ChoXacNhan:
        return 'Chờ xác nhận'
      case msEnum.enumStatusOrder.DaXacNhan:
        return 'Chờ lấy hàng'
      case msEnum.enumStatusOrder.DangGiao:
        return 'Đang giao'
      case msEnum.enumStatusOrder.DaNhanHang:
        return 'Đã nhận hàng'
      case msEnum.enumStatusOrder.HoanThanh:
        return 'Hoàn thành'
      case msEnum.enumStatusOrder.DaHuy:
        return 'Đã hủy'
      case msEnum.enumStatusOrder.TraHang:
        return 'Trả hàng'
    }
  },
  /**
   * Hàm validate input
   */
  inputValidation: (rules, name, value) => {
    const FORM_FIELD = resources.vi.FORM_FIELD
    const { NOT_EMPTY, UNIQUE, ADULT, HAS_FORMAT, MAX_LENGTH, MIN_LENGTH } = resources.FORM_RULES
    const ERROR = resources.vi.FORM_MESSAGE.ERROR
    const regexConstants = constants.regexConstants
    for (const rule of rules) {
      var arrRule = rule.split('|')
      var nameRule = arrRule[0]
      var keyRule = arrRule[1]
      switch (nameRule) {
        case NOT_EMPTY: {
          if (!value) return ERROR[nameRule](FORM_FIELD[name])
          break
        }
        case UNIQUE: {
          break
        }
        case ADULT: {
          if (value) {
            const date = new Date(value).getTime()
            const dateNow = new Date().getTime()
            if (date > dateNow) {
              return ERROR[nameRule](FORM_FIELD[name])
            }
          }
          break
        }
        case HAS_FORMAT: {
          if (value && !regexConstants[name].test(value)) return ERROR[nameRule](FORM_FIELD[name])
          break
        }
        case MAX_LENGTH: {
          if (value && value.length > keyRule) return ERROR[nameRule](FORM_FIELD[name], keyRule)
          break
        }
        case MIN_LENGTH: {
          if (value && value.length < keyRule) return ERROR[nameRule](FORM_FIELD[name], keyRule)
          break
        }
        default:
          break
      }
    }
  }
}

export default common
