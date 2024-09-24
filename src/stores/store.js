import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'
import config from '@/config'

export const useGlobal = defineStore('global', () => {
  const isLoadding = ref(false)
  const idModel = ref(undefined)
  const showHeaderOrFooter = ref(true)
  const user = reactive({})
  const columnsTableMyBook = reactive(new config().columnsTableMyBook)
  // const doubleCount = computed(() => count.value * 2)
  // function increment() {
  //   count.value++
  // }
  function isMask() {
    this.isLoadding = true
  }
  function unMask() {
    this.isLoadding = false
  }
  function setUser(user) {
    // const encodedUser = window.btoa(JSON.stringify(user));
    localStorage.setItem('user', JSON.stringify(user))
    this.user = user
  }
  function getUser() {
    try {
      const encodedUser = localStorage.getItem('user')
      if (encodedUser) {
        const user = JSON.parse(encodedUser)
        this.user = user
      }
    } catch (error) {
      localStorage.removeItem('token_admin')
    }
  }
  return {
    isLoadding,
    showHeaderOrFooter,
    isMask,
    unMask,
    setUser,
    user,
    columnsTableMyBook,
    idModel,
    getUser
  }
})
