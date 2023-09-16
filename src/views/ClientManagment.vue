<template>
  <div>
    <div class="header">
      <h1 class="title">应用管理</h1>
      <el-button type="primary" @click="showDialog = true">添加应用</el-button>
    </div>
    <CreateClientDialog v-model="showDialog" @confirm="handleNewClientData" />
    <CopySecretDialog v-model="showClientSecretDialog" :clientId="clientId" :clientSecret="clientSecret" />

    <el-dialog v-model="showDeleteDialog">
      <div>
        <h3>确认删除</h3>
        <p>你确定要删除以下应用吗？</p>
        <div>应用名称: {{ clientToDelete?.friendlyName }}</div>
        <div>应用 ID: {{ clientToDelete?.clientId }}</div>
      </div>
      <template #footer>
        <el-button @click="showDeleteDialog = false">取消</el-button>
        <el-button type="danger" @click="confirmDelete">确认删除</el-button>
      </template>
    </el-dialog>

    <div class="client-list">
      <el-card v-for="client in clients" :key="client.clientId" class="client-card">
        <div class="client-content">
          <img :src="'data:image/png;base64,' + client.iconBase64" class="avatar" />
          <div class="text-content">
            <div class="nickname">{{ client.friendlyName }}</div>
            <div class="client-id">{{ client.clientId }}</div>
            <div class="description">{{ client.description }}</div>
          </div>
          <el-button class="delete-icon" @click="deleteClient(client)">
            <el-icon>
              <Delete />
            </el-icon>
          </el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { createClient, listClients } from '../api/Client';
import CreateClientDialog from '../components/dialogs/clientManagerDialogs/CreateClientDialog.vue';
import CopySecretDialog from '../components/dialogs/clientManagerDialogs/CopySecretDialog.vue';

interface Client {
  clientId: string;
  friendlyName: string;
  description: string;
  iconBase64: string;
}

const showDialog = ref(false);
const clients = ref<Client[]>([]);

const showClientSecretDialog = ref(false);
const clientSecret = ref('');
const clientId = ref('');

const showDeleteDialog = ref(false);
const clientToDelete = ref<Client | null>(null);

watch(showDialog, (newVal: boolean) => {
  console.log(newVal)
})

listClients().then((data) => {
  clients.value = data;
});

const handleNewClientData = (newClient: any) => {
  //let encodedString: string = encodeURIComponent();
  createClient(newClient.friendlyName, newClient.description,
    newClient.iconBase64, newClient.redirectUri).then((response) => {
      if (response.clientId) {
        clientSecret.value = response.clientSecret;
        clientId.value = response.clientId;
        showClientSecretDialog.value = true;

        listClients().then((data) => {
          clients.value = data;
          showDialog.value = false;
        });
      }
    });
};

const deleteClient = (client: any) => {
  clientToDelete.value = client;
  showDeleteDialog.value = true;
};

const confirmDelete = () => {
  // 这里应调用删除 API
  showDeleteDialog.value = false;
};

</script>

<style scoped>
/* Header */
.header {
  display: flex;
  align-items: center;
  margin-left: 10px;
}

.header .title {
  margin: 0;
  margin-right: 20px;
}

/* Dialog */
.dialog-content {
  display: flex;
}

.dialog-content .left-content {
  width: 200px;
  text-align: center;
}

.dialog-content .right-content {
  flex: 1;
  padding-left: 20px;
}

.right-content .input-section {
  margin-bottom: 20px;
}

.right-content .textarea-expand {
  height: 100%;
}

/* Client List */
.client-list {
  display: flex;
  flex-wrap: wrap;
}

.client-list .client-card {
  width: 350px;
  margin: 10px;
  border-radius: 10px;
  overflow: hidden;
}

.client-card .client-content {
  display: flex;
  align-items: center;
  margin: -10px;
  position: relative;
}

.client-content .avatar {
  width: 50px;
  height: 50px;
  object-fit: cover;
}

.client-content .text-content {
  margin-left: 10px;
  margin-right: 50px;
}

.text-content .nickname {
  font-size: 16px;
  line-height: 1.2;
}

.text-content .client-id {
  font-size: 12px;
  line-height: 1.2;
}

.text-content .description {
  font-size: 12px;
  min-height: 28.8px;
  line-height: 1.2;
  color: #888;
  display: -webkit-box;
  /* 使用旧版 flexbox */
  -webkit-line-clamp: 2;
  /* 截断文本的行数 */
  -webkit-box-orient: vertical;
  /* 设置或检索伸缩盒对象的子元素的排列方式 */
  overflow: hidden;
  /* 隐藏超出的文本 */
  text-overflow: ellipsis;
  /* 使用省略号（...）表示被修剪的文本 */
  white-space: normal;
  /* 文本自动换行 */
}

.client-content .delete-icon {
  cursor: pointer;
  width: 20px;
  position: absolute;
  /* 设置为绝对定位 */
  right: 10px;
  /* 设置在最右侧并留一点间隔 */
  top: 50%;
  /* 垂直居中 */
  transform: translateY(-50%);
  /* 垂直居中偏移修正 */
}

/* Upload */
.avatar-uploader .avatar {
  width: 128px;
  height: 128px;
  display: block;
}

.client-secret {
  padding: 10px;
  border: 1px solid #ccc;
  font-family: monospace;
}
</style>

<!-- Global CSS -->
<style>
/* Avatar Upload */
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
