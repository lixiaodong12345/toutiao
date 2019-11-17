import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '@/views/login/login.vue'
import home from '@/views/home/home.vue'
import welcome from '@/views/welcome/welcome.vue'
import getArticle from '@/views/article/getArticle'
import articleadd from '@/views/articleadd/articleadd.vue'
import articleEdit from '@/views/articleEdit/articleEdit.vue'
import account from '@/views/account/account.vue'
import material from '@/views/material/material.vue'
import '@/assets/css/global.css'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: login
  },
  {
    path: '/home',
    name: 'home',
    component: home,
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        name: 'welcome',
        component: welcome
      },
      {
        path: '/getArticle',
        name: 'getArticle',
        component: getArticle
      },
      {
        path: '/articleadd',
        name: 'articleadd',
        component: articleadd
      },
      {
        path: '/articleEdit/:id',
        name: 'articleEdit',
        component: articleEdit
      },
      {
        path: '/account',
        name: 'account',
        component: account
      },
      {
        path: '/material',
        name: 'material',
        component: material
      }
    ]
  }
]

const router = new VueRouter({
  routes
})
router.beforeEach((to, from, next) => {
  let token = window.localStorage.getItem('token')
  if (!token && to.path !== '/login') {
    return next('/login')
  }
  next()
})

export default router
