import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useGlobal } from './stores/store'
import MLoadding from '@/components/loadding/MLoadding.vue'
import clickOutside from './common/clickOutside'

const app = createApp(App)
app.use(createPinia())
app.directive('click-outside', clickOutside)
app.config.globalProperties.$state = useGlobal()
app.component('MLoadding', MLoadding)
app.use(router)

app.mount('#app')
