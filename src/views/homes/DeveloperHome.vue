<template>
  <el-container>
    <el-header>
      <div class="header-content">
        <div class="logo">兔兔用户中心-开发者中心</div>
        <div class="user-avatar"></div>
      </div>
    </el-header>
    <el-container class="aside-container">
      <el-aside width="200px">
        <el-menu :router="true" class="aside-menu">
          <el-menu-item index="/developer-home/client-management">管理应用</el-menu-item>
          <el-menu-item index="/developer-home/feature2">管理授权</el-menu-item>
          <el-menu-item index="/logout" class="logout-item">登出</el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  setup() {
    // 逻辑代码
  },
});
</script>

<style scoped>
.el-header {
  background-color: lightblue;
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

.logout-item {
  margin-top: auto;
}


</style>
