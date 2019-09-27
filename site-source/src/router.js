import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    },
    {
      path: '/update-0',
      name: 'update-0',
      component: () => import(/* webpackChunkName: "update_0" */ './views/Update_0.vue')
    },
    {
      path: '/update-1',
      name: 'update-1',
      component: () => import(/* webpackChunkName: "update_1" */ './views/Update_1.vue')
    }
  ]
})
