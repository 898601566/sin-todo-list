// 导入createApp函数，用于创建Vue应用
import { createApp } from 'vue';
// 导入App组件
import App from './App.vue';
// 导入main.css样式文件
// import './assets/main.css';
// 导入ElementPlus组件库
import ElementPlus from 'element-plus';
// 导入ElementPlus的样式文件
import 'element-plus/dist/index.css';
import * as Icons from '@element-plus/icons-vue';
// 创建Vue应用
const app = createApp(App);

// 使用ElementPlus组件库
app.use(ElementPlus);
// 全局注册图标
Object.entries(Icons).forEach(([name, component]) => {
    app.component(name, component);
});
// 挂载Vue应用
app.mount('#app');
