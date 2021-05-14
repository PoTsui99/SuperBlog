import { createRouter, createWebHashHistory } from 'vue-router'
import ArticleDetail from '../views/ArticleDetail.vue'
import NotFound from '../views/NotFound.vue'
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'
import SignUp from '../views/SignUp.vue'
import Start from '../views/Start.vue'
import UserCenter from '../views/UserCenter.vue'
import Write from '../views/Write.vue'
import ArticleEdit from '../views/ArticleEdit.vue'
import OtherUserCenter from '../views/OtherUserCenter.vue'

const routes = [
  {
    path: '/',
    redirect: '/start'
  },
  {
    path: '/start',
    name: 'Start',
    component: Start
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
  },
  {
    path: '/loginInterface',
    name: 'LoginInterface',
    component: Login
  },
  {
    path: '/:catchAll(.*)',
    name: 'NotFound',
    component: NotFound
  },
  {
    path: '/article/:id',
    name: 'ArticleDetail',
    component: ArticleDetail,
    props: true
  },
  {
    path: '/SignUpInterface',
    name: 'SignUpInterface',
    component: SignUp
  },
  {
    path: '/UserCenter',
    name: 'UserCenter',
    component: UserCenter
  },
  {
    path: '/Write',
    name: 'Write',
    component: Write
  },
  {
    path: '/article/:id/edit',
    name: 'ArticleEdit',
    component: ArticleEdit,
    props: true
  },
  {
    path: '/user/:id',
    name: 'OtherUserCenter',
    component: OtherUserCenter,
    props: true
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
