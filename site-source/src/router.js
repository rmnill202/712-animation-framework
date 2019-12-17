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
    },
    {
      path: '/update-2',
      name: 'update-2',
      component: () => import(/* webpackChunkName: "update_2" */ './views/Update_2.vue')
    },
    {
      path: '/update-3',
      name: 'update-3',
      component: () => import(/* webpackChunkName: "update_3" */ './views/Update_3.vue')
    },
    {
      path: '/update-4',
      name: 'update-4',
      component: () => import(/* webpackChunkName: "update_4" */ './views/Update_4.vue')
    },
    {
      path: '/update-5',
      name: 'update-5',
      component: () => import(/* webpackChunkName: "update_5" */ './views/Update_5.vue')
    },
    {
      path: '/update-6',
      name: 'update-6',
      component: () => import(/* webpackChunkName: "update_6" */ './views/Update_6.vue')
    }
  ]
})
