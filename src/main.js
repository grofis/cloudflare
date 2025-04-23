import { createApp } from 'vue'
import 'ant-design-vue/dist/reset.css';
import App from './app.vue'

import router from './router'

import * as Icons from '@ant-design/icons-vue';

const app = createApp(App)
app.use(router)
// 全局注册所有图标组件
Object.keys(Icons).forEach(key => {
    app.component(key, Icons[key]);
});
app.mount('#app')