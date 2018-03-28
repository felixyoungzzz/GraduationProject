import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: () => import('../pages/login.vue'),
    },
    {
      path: '/stock',
      name: 'Stock',
      component: () => import('../pages/stock.vue'),
      children: [
        {
          path: '/home',
          name: 'Home',
          component: () => import('../pages/home.vue'),
        },
        {
          path: '/mycollection',
          name: 'MyCollection',
          component: () => import('../pages/mycollection.vue'),
        },
        {
          path: '/candlestickview',
          name: 'CandleStickView',
          component: () => import('../pages/candlestickview.vue'),
        },
        {
          path: '/personalcenter',
          name: 'PersonalCenter',
          component: () => import('../pages/personalcenter.vue'),
        },
      ],
    },
  ],
});

router.beforeEach((to, from, next) => {
  const token = sessionStorage.getItem('stock-project');
  if (to.path == '/') {
    if (token && token !== 'null') {
      next('/stock');
    } else {
      next();
    }
  } else {
    if (token && token !== 'null') {
      Vue.prototype.$http.defaults.headers.common['Authorization'] =
        'Bearer ' + token;
      next();
    } else {
      next('/');
    }
  }
});

export default router;
