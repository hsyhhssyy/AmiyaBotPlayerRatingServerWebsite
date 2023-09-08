import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue'; 
import Home from '../views/Home.vue'; 
import CredManagement from '../views/CredManagement.vue';
import Feature2 from '../views/Feature2.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
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

router.beforeEach((to, from, next) => {
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
