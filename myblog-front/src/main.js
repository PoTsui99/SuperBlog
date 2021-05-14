import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
// 引用element-ui组件
import ElementPlus from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css'
// 引用github-markdown-css用于渲染markdown文档
// 需要使用的地方添加markdown-body
import 'github-markdown-css'



const app = createApp(App)
app.use(ElementPlus)
app.use(router)
app.mount('#app')