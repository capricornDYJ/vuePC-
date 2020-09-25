import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 手动配置element.ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './plugins/element.js'
//导入table-tree
import TreeTable from 'vue-table-with-tree-grid'
Vue.component('tree-table',TreeTable)
//导入字体图标
import './assets/fonts/iconfont.css'

import moment from "moment"
Vue.filter('dateFormate',function(params) {
 return  (moment().format('YYYY:MM:DD - HH:mm:ss') )
}

)


//导入tree-table
import treeTable from 'vue-table-with-tree-grid'
 
Vue.use(treeTable)

// 1导入axios --基地址和拦截器要在挂载实例前
import axios from "axios";
// import { config } from 'vue/types/umd'
// 2配置基地址
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
//3 挂载拦截器
  //响应拦截器 响应之前会请求拦截器
 axios.interceptors.request.use(
function (config) {
  config.headers.Authorization = sessionStorage.getItem('token');
  return config
 },
 function (error) {
  return Promise.reject(error);
 }
);

//引入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'

// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.use(VueQuillEditor)

// 去除日志信息
Vue.config.productionTip = false

//3挂载axios
// 将axios当做一个属性挂载给Vue的函数的原型上  这样在全局都可以用这个方法了   挂上去的时候用的    $http(是个变量) 代替了 axios这个名字
Vue.prototype.$http = axios

Vue.use(ElementUI)
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
