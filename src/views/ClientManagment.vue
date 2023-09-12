<template>
  <div>
    <div class="header">
      <h1 class="title">应用管理</h1>
      <el-button type="primary" @click="showDialog = true">添加应用</el-button>
    </div>
    <el-dialog v-model="showDialog">
      <div class="dialog-content">
        <div class="left-content">
          <label for="avatarUploader">应用图标</label>
          <el-upload class="avatar-uploader" :show-file-list="false" :auto-upload="false" :on-change="beforeAvatarUpload">
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon">
              <Plus />
            </el-icon>
          </el-upload>
        </div>
        <div class="right-content flex-container">
          <div class="input-section">
            <label for="friendlyName">应用名称</label>
            <el-input id="friendlyName" v-model="newClient.friendlyName" placeholder="请输入 Friendly Name"></el-input>
          </div>
          <div class="input-section flex-item">
            <label for="clientId">应用描述</label>
            <el-input id="clientId" type="textarea" v-model="newClient.description" placeholder="请输入应用描述"
              class="textarea-expand" resize="none" input-style="height: 100%"></el-input>
          </div>
        </div>
      </div>
      <template #footer>
        <el-button @click="showDialog = false">取消</el-button>
        <el-button type="primary" @click="addClient">确认添加</el-button>
      </template>
    </el-dialog>
    <el-dialog v-model="showClientSecretDialog">
      <div>
        <h3>请复制并保存以下应用Id和Secret</h3>
        <p>警告：关闭对话框后将无法再次查看该应用对应的Secret。请不要泄露Secret给任何第三方。</p>
        <label for="clientId">应用Id:</label>
        <div id="clientId" class="client-secret">{{ clientId }}</div>
        <label for="clientSecret">应用Secret:</label>
        <div id="clientSecret" class="client-secret">{{ clientSecret }}</div>
      </div>
      <template #footer>
        <el-button @click="showClientSecretDialog = false">已复制，关闭</el-button>
      </template>
    </el-dialog>
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

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { createClient, listClients } from '../api/AccountAndClient';

interface Client {
  clientId: string;
  friendlyName: string;
  description: string;
  iconBase64: string;
}

export default defineComponent({
  setup() {
    const showDialog = ref(false);
    const newClient = ref({
      friendlyName: '',
      description: '',
      iconBase64: ''
    });
    const clients = ref<Client[]>([]);
    const imageUrl = ref('');

    const showClientSecretDialog = ref(false);
    const clientSecret = ref('');
    const clientId = ref('');

    const showDeleteDialog = ref(false);
    const clientToDelete = ref<Client | null>(null);

    listClients().then((data: Client[]) => {
      clients.value = data;
    });

    const beforeAvatarUpload = (file: any) => {
      // const isJPG = file.type === 'image/jpeg';
      // const isPNG = file.type === 'image/png';
      // const isLt2M = file.size / 1024 / 1024 < 2;

      // if (!isJPG && !isPNG) {
      //   ElMessage.error('Avatar picture must be JPG or PNG format!');
      //   return false;
      // }

      // if (!isLt2M) {
      //   ElMessage.error('Avatar picture size cannot exceed 2MB!');
      //   return false;
      // }

      const reader = new FileReader();

      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target?.result as string;

        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = 128;
          canvas.height = 128;

          const ctx = canvas.getContext('2d')!;
          ctx.drawImage(img, 0, 0, 128, 128);

          const dataURL = canvas.toDataURL();
          newClient.value.iconBase64 = dataURL.split(',')[1];
          imageUrl.value = dataURL;
        };
      };

      reader.readAsDataURL(file.raw);

      return true;
    };


    const addClient = () => {
      // 创建新的 Client
      createClient(newClient.value.friendlyName, newClient.value.description, newClient.value.iconBase64).then((response: any) => {
        if (response.clientId) {
          clientSecret.value = response.clientSecret;
          clientId.value = response.clientId;
          showClientSecretDialog.value = true;

          listClients().then((data: Client[]) => {
            clients.value = data;
            showDialog.value = false;
          });
        }
      });
    };

    const deleteClient = (client: Client) => {
      clientToDelete.value = client;
      showDeleteDialog.value = true;
    };

    const confirmDelete = () => {
      // 这里应调用删除 API
      // 假设有一个 deleteClient() 函数来发送删除请求
      // ...
      showDeleteDialog.value = false;
    };

    return {
      showDialog,
      newClient,
      clients,
      showClientSecretDialog,
      clientSecret,
      addClient,
      imageUrl,
      clientId,
      deleteClient,
      beforeAvatarUpload,
      showDeleteDialog,
      clientToDelete,
      confirmDelete
    };
  },
});
</script>
<!-- Scoped CSS -->
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
