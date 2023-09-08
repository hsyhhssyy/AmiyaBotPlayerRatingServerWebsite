<template>
  <el-container>
    <el-header>
      <div class="header-content">
        <div class="logo">您的Logo</div>
        <div class="user-avatar">用户头像</div>
      </div>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <el-menu :router="true">
          <el-menu-item index="/cred-management">Cred 管理</el-menu-item>
          <el-menu-item index="/feature2">功能 2</el-menu-item>
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
</style>
