import Vue from 'vue'
import Router from 'vue-router'
// import Hello from '@/components/Hello'

Vue.use(Router)


// 路由懒加载
// const Http404 = r => require.ensure([], () => r(require('../components/404.vue')), 'Http404')
// 404页面
const Http404 = resolve => require(['../components/404.vue'], resolve)
// 登录
const Login = resolve => require(['../page/login/login.vue'], resolve)

// 首页
const Home = resolve => require(['../page/home/home.vue'], resolve)
// 扫码
const Sm = resolve => require(['../page/sm/sm.vue'], resolve)
const Code = resolve => require(['../page/sm/code.vue'], resolve)
// const Sm = resolve => require(['../page/sm/sm.vue'], resolve)
// 推送
const Ts = resolve => require(['../page/ts/ts.vue'], resolve)
const Result = resolve => require(['../page/ts/result.vue'], resolve)

//签署页面
const Sign = resolve => require(['../page/sign/sign.vue'], resolve)
const SignResult = resolve => require(['../page/sign/result.vue'], resolve)

//签署记录
const Record = resolve => require(['../page/record/record.vue'], resolve)

//文档详情
const Detail = resolve => require(['../page/detail/detail.vue'], resolve)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: {name: 'Login'},
      component: Login
    },
    {
      path: '*',
      redirect: {name: 'Http404'},
      component: Home
    },
    {
      path: '/http404',
      name: 'Http404',
      component: Http404
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/home',
      name: 'Home',
      component: Home
    },
    {
      path: '/home/:type/:token',
      component: Home
    },
    {
      path: '/sm',
      name: 'Sm',
      component: Sm
    },
    {
      path: '/code/:type/:id/:uuid/:fileName',
      name: 'Code',
      component: Code,
      meta:{
        type:'101'
      }
    },
    {
      path: '/ts',
      name: 'Ts',
      component: Ts
    },
    {
      path: '/result/:type/:id/:uuid/:fileName',
      name: 'Result',
      component: Result,
      meta:{
        type:'201'
      }
    },
    {
      path:"/sign",
      name:"Sign",
      component:Sign
    },
    {
      path:"/sign/result/:fileName/:id",
      name:"SignResult",
      component:SignResult,
      meta:{
        type:'401'
      }
    },
    {
      path:"/record",
      name:"Record",
      component:Record,
    },
    {
      path:"/detail/:id",
      name:"Detail",
      component:Detail,
      meta:{
        type:'501'
      }
    }
  ]
})
