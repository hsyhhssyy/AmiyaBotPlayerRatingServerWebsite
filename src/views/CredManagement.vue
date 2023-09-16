<template>
  <div>
    <div class="header">
      <h1 class="title">凭据管理</h1>
      <el-button type="primary" @click="showDialog = true">添加凭据</el-button>
    </div>
    <el-dialog v-model="showDialog">
      <el-input v-model="newCred" placeholder="请输入凭据"></el-input>
      <template #footer>
        <el-button @click="showDialog = false">取消</el-button>
        <el-button type="primary" @click="addCred">确认添加</el-button>
      </template>
    </el-dialog>
    <div class="cred-list">
      <CredCard
        v-for="cred in creds"
        :key="cred.id"
        :cred="cred"
        :deleteCred="deleteCred"
      />
    </div>
  </div>
</template>
  
<script lang="ts">
import { defineComponent, ref } from 'vue';
import CredCard,{ Cred } from '../components/CredentialCard.vue';
import { getCredentials, createCredential,deleteCredential } from '../api/SKLandCredential';
import { ElMessage } from 'element-plus';

export default defineComponent({
  components: {
    CredCard  // 注册 CredCard 组件
  },
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
        if (response.id) {
          getCredentials().then((data: Cred[]) => {
            creds.value = data;
            showDialog.value = false;
          });
        }
      });
    };

    const deleteCred = (credId: string) => {
      deleteCredential(credId).then((_response) => {
        ElMessage.info('凭据已删除');
        getCredentials()
      });
    };

    return {
      showDialog,
      newCred,
      creds,
      addCred,
      deleteCred,
    };
  },
});
</script>
  
<style scoped>
.header {
  display: flex;
  align-items: center;
  margin-left: 10px;  /* 调整左边距，以与下面的卡片左边框对齐 */
}

.title {
  margin: 0;
  margin-right: 20px;  /* 设置标题和按钮之间的间距 */
}

.cred-list {
  display: flex;
  flex-wrap: wrap;
}

</style>
  