<template>
  <div>
    <h1>Cred 管理</h1>
    <el-button type="primary" @click="showDialog = true">添加 Cred</el-button>
    <el-dialog v-model="showDialog">
      <el-input v-model="newCred" placeholder="请输入 Cred"></el-input>
      <template #footer>
        <el-button @click="showDialog = false">取消</el-button>
        <el-button type="primary" @click="addCred">确认添加</el-button>
      </template>
    </el-dialog>
    <div class="cred-list">
      <el-card v-for="cred in creds" :key="cred.Id" class="cred-card">
        <img :src="cred.AvatarUrl" class="avatar" />
        <div class="nickname">{{ cred.Nickname }}</div>
      </el-card>
    </div>
  </div>
</template>
  
<script lang="ts">
import { defineComponent, ref } from 'vue';
import { getCredentials, createCredential } from '../api/SKLandCredential';

interface Cred {
  Id: string;
  Nickname: string;
  AvatarUrl: string;
}

export default defineComponent({
  setup() {
    const showDialog = ref(false);
    const newCred = ref('');
    const creds = ref<Cred[]>([]);

    // 初始化获取 Cred 列表
    getCredentials().then((data: Cred[]) => {
      creds.value = data;
    });

    const addCred = () => {
      // 创建新的 Cred
      createCredential(newCred.value).then((response) => {
        if (response.success) {
          creds.value.push(response.data);
          showDialog.value = false;
        }
      });
    };

    return {
      showDialog,
      newCred,
      creds,
      addCred,
    };
  },
});
</script>
  
<style scoped>
.cred-list {
  display: flex;
  flex-wrap: wrap;
}

.cred-card {
  width: 200px;
  margin: 10px;
}

.avatar {
  width: 50px;
  height: 50px;
  object-fit: cover;
}

.nickname {
  text-align: center;
  margin-top: 10px;
}
</style>
  