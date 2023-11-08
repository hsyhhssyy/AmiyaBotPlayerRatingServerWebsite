<template>
  <el-container>
    <el-header>
      <div class="header-content">
        <div class="logo">兔兔用户中心</div>
        <div class="user-avatar"></div>
      </div>
    </el-header>
    <el-container class="aside-container">
      <el-aside width="200px">
        <el-menu :router="true" class="aside-menu">
          <el-sub-menu v-for="(menu, name) in sidemenuMapping" :key="name" :index="name">
            <template #title>
              <el-icon>
                <component :is="menu.icon"></component>
              </el-icon>
              <span>{{ name }}</span>
            </template>
            <el-menu-item v-for="item in menu.items" :key="item.path" :index="item.path">
              <el-icon>
                <component :is="item.icon"></component>
              </el-icon>
              <span>{{ item.name }}</span>
            </el-menu-item>
          </el-sub-menu>
          <el-menu-item index="/logout" class="logout-item">
            <el-icon>
              <SwitchButton />
            </el-icon>
            <span>登出</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <div class="app-container">
        <!-- 面包屑导航 -->
        <nav class="breadcrumb-container">
          <el-breadcrumb class="breadcrumb" separator="/">
            <el-breadcrumb-item v-for="(item, index) in breadcrumbList" :key="index" :to="item.path">
              {{ item.name }}
            </el-breadcrumb-item>
          </el-breadcrumb>
          <!-- 工具栏插槽，用于在不同页面插入不同的工具栏组件 -->
          <div class="toolbar-container">
            <component :is="toolbarcomponent"></component>
          </div>
        </nav>
        <el-main>
          <router-view></router-view>
        </el-main>
      </div>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useRoute,useRouter } from 'vue-router';
import { ElBreadcrumb, ElBreadcrumbItem } from 'element-plus';

const route = useRoute();
const router = useRouter();

const sidemenuMapping = {
  // '森空岛凭据': {
  //   icon: 'Key',
  //   items: [
  //     { name: '凭据管理', path: '/regular-home/cred-management', icon: 'Connection' }
  //   ]
  // },
  'MAA管理': {
    icon: 'Iphone',
    items: [
      { name: 'MAA连接', path: '/regular-home/maa-management', icon: 'Connection' }

    ]
  },
};

const toolbarcomponent = computed(() => {
  const routeRecord = route.matched[route.matched.length - 1];
  return routeRecord.meta.toolbarComponent;
});


const breadcrumbList = computed(() => {
  let matchedRoutes = route.matched.filter((r) => r.name);
  let breadcrumbs : any[] = [];

  // 为了找到一级菜单的名称，我们从sidemenuMapping映射开始
  let firstLevelName = '';
  for (const [menuName, menuDetails] of Object.entries(sidemenuMapping)) {
    for (const item of menuDetails.items) {
      if (route.path.startsWith(item.path)) {
        firstLevelName = menuName; // 找到一级菜单名称
        break;
      }
    }
    if (firstLevelName) break; // 如果找到了一级菜单名称，退出循环
  }

  // 如果在侧边栏映射中找到一级菜单，先添加一级菜单项，并且不提供Path，因为一级菜单没有对应的路由
  if (firstLevelName) {
    breadcrumbs.push({ name: firstLevelName, path:""});
  }
  
  const reverseCreateBreadcrumbs = (routeRecords: any) => {
    // 先获取matchedRoutes数组的长度
    const length = routeRecords.length;

    // 倒序遍历matchedRoutes来建立面包屑路径，合并侧边栏和路由信息
    for (let i = length - 1; i >= 0; i--) {
      const routeRecord = routeRecords[i];

      // 如果是一级菜单并且已经添加过了，就跳过
      if (routeRecord.path === '/regular-home' && firstLevelName) continue;

      // 插入在第一项之后（因为是倒序遍历）
      breadcrumbs.splice(1, 0, { name: routeRecord.name, path: routeRecord.path });
      
      // 如果routeRecord没有meta.parent属性，它应该是一级菜单，跳过
      if (!routeRecord.meta.parent) {
        continue;
      }

      //读到第一个有parent的项目，后面都不需要了
      var parent = routeRecord.meta.parent;
      const resolvedRoutes = router.resolve({ name: parent });
      reverseCreateBreadcrumbs(resolvedRoutes.matched.filter((r) => r.name));
      break;
    }
  };

  reverseCreateBreadcrumbs(matchedRoutes);

  return breadcrumbs;
});


</script>

<style scoped>
.el-header {
  background-color: #b3c0d1;
  color: white;
  text-align: center;
  line-height: 60px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  margin-left: 20px;
}

.user-avatar {
  margin-right: 20px;
}


.aside-menu {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.app-container {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.breadcrumb-container {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding-top: 20px;
}

.breadcrumb {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 30px;
}

.toolbar-container {
  margin-left: 20px;
}

.logout-item {
  margin-top: auto;
}


</style>