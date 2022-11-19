import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/article/:articleID',
    name: 'article',
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/ArticleView.vue')
  },
  {
    path: '/',
    name: 'articles',
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/ArticlesView.vue')
  }
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router
