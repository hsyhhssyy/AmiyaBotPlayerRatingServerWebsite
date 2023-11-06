<template>
    <el-container>
        <el-header>
            <div class="header-content">
                <div class="logo">森空岛凭据管理中心-管理员后台</div>
                <div class="user-avatar"></div>
            </div>
        </el-header>
        <el-container class="aside-container">
            <el-aside width="200px">
                <el-menu :router="true" class="aside-menu">
                    <el-menu-item @click="openInNewTab('/api/hangfire')">Hangfire</el-menu-item>
                    <el-menu-item index="/logout" class="logout-item">登出</el-menu-item>
                </el-menu>
            </el-aside>
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>
  
<script setup lang="ts">

const openInNewTab = (url: string) => {
    window.open(url, '_blank');
}

</script>
  
<style scoped>
.el-header {
    background-color: red;
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
  