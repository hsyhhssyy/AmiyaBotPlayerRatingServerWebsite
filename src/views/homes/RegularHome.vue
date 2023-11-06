<template>
  <el-container>
    <el-header>
      <div class="header-content">
        <div class="logo">森空岛凭据管理中心</div>
        <div class="user-avatar"></div>
      </div>
    </el-header>
    <el-container class="aside-container">
      <el-aside width="200px">
        <el-menu :router="true" class="aside-menu">
          <el-menu-item index="/regular-home/cred-management">
            <el-icon>
              <Key />
            </el-icon>
            <span>管理凭据</span>
          </el-menu-item>
          <el-sub-menu index="1">
            <template #title>
              <el-icon>
                <Iphone />
              </el-icon>
              <span>MAA管理</span>
            </template>
            <el-menu-item index="/regular-home/maa-managment">
              <el-icon>
                <Connection />
              </el-icon>
              <span>连接管理</span>
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

.logout-item {
  margin-top: auto;
}
</style>
