import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import RegularHome from '../views/RegularHome.vue';
import CredManagement from '../views/CredManagement.vue';
import Feature2 from '../views/Feature2.vue';
import Authorize from '../views/Authorize.vue';
import Register from '../views/Register.vue';
import DeveloperHome from '../views/DeveloperHome.vue';
import ClientManagment from '../views/ClientManagment.vue';
import Logout from '../views/Logout.vue';
import OAuth from '../views/OAuth.vue';

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
    path: '/regular-home',
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
    path: '/developer-home',
    name: 'developer-home',
    component: DeveloperHome,
    children: [
      {
        path: 'client-management',
        component: ClientManagment,
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
  {
    path: '/logout',
    name: 'Logout',
    component: Logout,
  },
  {
    path: '/OAuth',
    name: 'OAuth',
    component: OAuth,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, _from, next) => {
  if (to.path !== '/' && to.path !== '/developer-home' && to.path !== '/regular-home') {
    next();
    return;
  }

  // 检查是否有 token
  const token = localStorage.getItem('jwt-token');

  if (token) {
    const role = localStorage.getItem('user-role');
    if (role === "开发者账户" && to.path !== '/developer-home') {
      next('/developer-home');
    } else if (role !== "开发者账户" && to.path !== '/regular-home') {
      next('/regular-home');
    } else {
      next();
    }
  } else {
    // 如果没有 token，重定向到登录页
    next('/login');
  }
});

export default router;
