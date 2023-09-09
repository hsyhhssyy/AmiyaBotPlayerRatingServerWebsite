import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue'; 
import RegularHome from '../views/RegularHome.vue'; 
import CredManagement from '../views/CredManagement.vue';
import Feature2 from '../views/Feature2.vue';
import Authorize from '../views/Authorize.vue';
import Register from '../views/Register.vue';

const routes = [
  {
    path: '/register',
    name: 'Register',
    component: Register,
  },
  {
    path: '/authorize',
    name: 'Authorize',
    component: Authorize,
  },
  {
    path: '/',
    name: 'regular-home',
    component: RegularHome,
    children: [
      {
        path: 'cred-management',
        component: CredManagement,
      },
      {
        path: 'feature2',
        component: Feature2,
      },
    ],
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, _from, next) => {
  if (to.path !== '/') {
    next();
    return;
  }

  // 检查是否有 token
  const token = localStorage.getItem('jwt-token');

  if (token) {
    // 如果有 token，允许进入预定路由
    next();
  } else {
    // 如果没有 token，重定向到登录页
    next('/login');
  }
});

export default router;
