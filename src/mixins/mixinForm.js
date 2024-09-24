export default {
  data() {
    return {
      errorMsgObject: {}
    }
  },
  methods: {
    /**
     * Xử lý khi input message lỗi
     */
    handleBindMessageInput(name, msgError) {
      this.errorMsgObject[name] = msgError
    },

    /**
     * Hàm validate form true : không lỗi
     */
    checkValidateFormSubmit() {
      for (const property in this.$refs) {
        this.$refs[property]?.checkValidate()
      }
      this.customValidate()
      for (const property in this.errorMsgObject) {
        if (this.errorMsgObject[property]) {
          this.$refs[property].onFocus()
          return false
        }
      }
      return true
    },
    customValidate() {}
  },
  watch: {
    formData: {
      handler(newValue) {
        this.$emit('update:modelValue', newValue)
      },
      deep: true
    },
    modelValue: {
      handler(newValue) {
        this.formData = newValue
      },
      deep: true
    }
  }
}
