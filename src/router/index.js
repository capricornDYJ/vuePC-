import Vue from 'vue'
import VueRouter from 'vue-router'
//导入全局css
import "../assets/css/globel.css"
//导入登录组件
import login from '../component/login.vue'
//导入home 电商管理组件
import home from '../component/home.vue'
//导入welcome 组件
import welcome from "../component/welcome.vue"
//导入users组件
import users  from "../component/users/users.vue"
//导入users组件
import rights  from "../component/rights/rights.vue"
//导入roles组件
import roles  from "../component/rights/roles.vue"
//导入goods组件
import goods  from "../component/goods/goods.vue"
//导入params组件
import params from "../component/goods/params.vue"
//导入order组件
import categories from "../component/goods/categories.vue"
//导入add组件
import add from "../component/goods/add.vue"
//导入order组件
import order from "../component/order/order.vue"

Vue.use(VueRouter)

//创建login路由规则
const routes = [
  //设置login重定向
  {path:'/',redirect:"/login"},
  //设置login组件规则
  {path:'/login',component: login},
  //设置home组件规则  在home组件中有一个welcom的子组件 users组件
  {path:'/home',component: home,
  redirect:'/welcome',
  children:[
    {path:'/welcome',component:welcome},
    {path:'/users',component:users},
    {path:'/rights',component:rights},
    {path:'/roles',component:roles},
    {path:"/params",component:params},
    {path:"/categories",component:categories},
    {path:"/goods",component:goods},
    {path:"/goods/add",component:add},
    {path:"/orders",component:order},
  ]
}

]


//创建路由实例并挂载路由规则
const router = new VueRouter({
  routes
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 代表从哪个路径跳转而来
  // next 是一个函数，表示放行
  //     next()  放行    next('/login')  强制跳转

  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
