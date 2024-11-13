import { createApp } from 'vue'
import 'ant-design-vue/dist/reset.css';
import App from './app.vue'

import router from './router'

const app = createApp(App)
app.use(router)
app.mount('#app')