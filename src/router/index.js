import Vue from 'vue';
import Router from 'vue-router';
import Login from '../pages/login.vue';
import Stock from '../pages/stock.vue';
import Home from '../pages/home.vue';
import MyCollection from '../pages/mycollection.vue';
import CandleStickView from '../pages/candlestickview.vue';
import PersonalCenter from '../pages/personalcenter.vue';

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login,
    },
    {
      path: '/stock',
      name: 'Stock',
      component: Stock,
      children: [
        {
          path: '/home',
          name: 'Home',
          component: Home,
        },
        {
          path: '/mycollection',
          name: 'MyCollection',
          component: MyCollection,
        },
        {
          path: '/candlestickview',
          name: 'CandleStickView',
          component: CandleStickView,
        },
        {
          path: '/personalcenter',
          name: 'PersonalCenter',
          component: PersonalCenter,
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
