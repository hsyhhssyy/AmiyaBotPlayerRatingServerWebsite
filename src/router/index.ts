import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import RegularHome from '../views/homes/RegularHome.vue';
import DeveloperHome from '../views/homes/DeveloperHome.vue';
import AdminHome from '../views/homes/AdminHome.vue';
import CredManagement from '../views/sklandViews/CredManagement.vue';
import Feature2 from '../views/Feature2.vue';
import Authorize from '../views/Authorize.vue';
import Register from '../views/Register.vue';
import ClientManagment from '../views/developerViews/ClientManagment.vue';
import Logout from '../views/Logout.vue';
import OAuth from '../views/OAuth.vue';
import MAAConnectionList from '../views/maaViews/MAAConnectionList.vue';
import MAAConnectionListToolbar from '@src/components/toolbars/MAAConnectionListToolbar.vue';
import MAATaskListToolbar from '@src/components/toolbars/MAATaskListToolbar.vue';
import MAATaskList from '@src/views/maaViews/MAATaskList.vue';

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
    name: '首页',
    component: RegularHome,
    children: [
      {
        path: 'cred-management',
        name: '凭据管理',
        component: CredManagement,
      },
      {
        path: 'maa-management',
        name: 'MAA连接',
        meta: { 
          toolbarComponent: MAAConnectionListToolbar 
        },
        component: MAAConnectionList
      },      
      {
        path: 'maa-management/:connectionId/task-list',
        name: '任务列表',
        component: MAATaskList,
        meta: { 
          parent: 'MAA连接',
          toolbarComponent: MAATaskListToolbar 
        },
        props: true
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
    path: '/admin-home',
    name: 'admin-home',
    component: AdminHome,
    children: [
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
  if (to.path !== '/' && to.path !== '/developer-home' && to.path !== '/regular-home' && to.path !== '/admin-home') {
    next();
    return;
  }

  // 检查是否有 token
  const token = localStorage.getItem('jwt-token');

  if (token) {
    const role = localStorage.getItem('user-role');
    if ( (role === "开发者账户"||role === "演示开发者账户") && to.path !== '/developer-home') {
      next('/developer-home');
    } else if (role === "管理员账户" && to.path !== '/admin-home') {
      next('/admin-home');
    } else if (role !== "开发者账户" && role !== "管理员账户" && role !== "演示开发者账户" && to.path !== '/regular-home') {
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
