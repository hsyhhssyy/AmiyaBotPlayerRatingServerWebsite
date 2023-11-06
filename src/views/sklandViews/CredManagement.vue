<template>
  <div>
    <div class="header">
      <h1 class="title">凭据管理</h1>
      <el-button type="primary" @click="showAddCredDialog = true">添加凭据</el-button>
    </div>
    <el-dialog v-model="showAddCredDialog">
      <el-input v-model="newCred" placeholder="请输入凭据"></el-input>
      <template #footer>
        <el-button @click="showAddCredDialog = false">取消</el-button>
        <el-button type="primary" @click="addCred">确认添加</el-button>
      </template>
    </el-dialog>
    <div class="cred-list">
      <CredCard v-for="cred in creds" :key="cred.id" :cred="cred" :deleteCred="deleteCred" />
    </div>
    <DeleteCredDialog ref="deleteCredDialog" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import CredCard, { Cred } from '../../components/CredentialCard.vue';
import { getCredentials, createCredential, deleteCredential } from '../../api/SKLandCredential';
import DeleteCredDialog from '../../components/dialogs/credManagmentDialogs/DeleteCredDialog.vue';
import { ElMessage } from 'element-plus'

const showAddCredDialog = ref(false);
const newCred = ref('');
const creds = ref<Cred[]>([]);

const deleteCredDialog = ref<InstanceType<typeof DeleteCredDialog> | null>(null)

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
        showAddCredDialog.value = false;
      });
    }
  });
};

const deleteCred = async (credId: string) => {
  var cred = creds.value.find(c => c.id === credId)
  if (cred) {
    var result = await deleteCredDialog.value?.showDialog(cred.nickname, cred.credential);
    if (result) {
      await deleteCredential(credId)

      ElMessage.info('凭据已删除');
      getCredentials().then((data: Cred[]) => {
        creds.value = data;
      });
    }
  }
};
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  margin-left: 10px;
  /* 调整左边距，以与下面的卡片左边框对齐 */
}

.title {
  margin: 0;
  margin-right: 20px;
  /* 设置标题和按钮之间的间距 */
}

.cred-list {
  display: flex;
  flex-wrap: wrap;
}
</style>
  