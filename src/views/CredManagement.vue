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
      <el-card v-for="cred in creds" :key="cred.id" class="cred-card">
        <div class="cred-content">
          <img :src="cred.avatarUrl" class="avatar" />
          <div class="text-content">
            <div class="nickname">{{ cred.nickname }}</div>
            <div class="uid">{{ cred.id }}</div>
          </div>
          <el-button class="delete-icon" @click="deleteCred(cred.id)">
          <el-icon ><Delete /></el-icon>
          </el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>
  
<script lang="ts">
import { defineComponent, ref } from 'vue';
import { getCredentials, createCredential } from '../api/SKLandCredential';

interface Cred {
  id: string;
  nickname: string;
  avatarUrl: string;
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
        if (response.id) {
          getCredentials().then((data: Cred[]) => {
            creds.value = data;
            showDialog.value = false;
          });
        }
      });
    };

    const deleteCred = (_credId: string) => {
      // 这里应调用删除 API
      // 假设有一个 deleteCredential() 函数来发送删除请求
      // deleteCredential(credId).then(response => {
      //   if (response.message === "Credential successfully deleted.") {
      //     // 从列表中移除已删除的 Cred
      //     creds.value = creds.value.filter(cred => cred.id !== credId);
      //   }
      // });
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
.cred-card {
  width: 300px;
  margin: 10px;
  border-radius: 10px;  /* 添加圆角 */
  overflow: hidden;  /* 使内部元素不超出圆角 */
}

.cred-content {
  display: flex;
  align-items: center;
  margin: -10px;
  position: relative;
}

.avatar {
  width: 50px;
  height: 50px;
  object-fit: cover;
}

.text-content {
  margin-left: 10px;
}

.nickname {
  font-size: 16px;
  line-height: 1.2;
}

.uid {
  font-size: 12px;
  line-height: 1.2;
  color: #888;
}

.delete-icon {
  cursor: pointer;
  width: 20px;
}

</style>
  