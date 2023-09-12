<template>
  <div>
    <div class="header">
      <h1 class="title">Client 管理</h1>
      <el-button type="primary" @click="showDialog = true">添加 Client</el-button>
    </div>
    <el-dialog v-model="showDialog">
      <el-input v-model="newClient.friendlyName" placeholder="请输入 Friendly Name"></el-input>
      <el-input v-model="newClient.iconBase64" placeholder="请输入 Icon Base64"></el-input>
      <template #footer>
        <el-button @click="showDialog = false">取消</el-button>
        <el-button type="primary" @click="addClient">确认添加</el-button>
      </template>
    </el-dialog>
    <div class="client-list">
      <el-card v-for="client in clients" :key="client.clientId" class="client-card">
        <div class="client-content">
          <img :src="client.iconBase64" class="avatar" />
          <div class="text-content">
            <div class="nickname">{{ client.friendlyName }}</div>
            <div class="uid">{{ client.clientId }}</div>
          </div>
          <el-button class="delete-icon" @click="deleteClient(client.clientId)">
            <el-icon name="el-icon-delete"></el-icon>
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
  iconBase64: string;
}

export default defineComponent({
  setup() {
    const showDialog = ref(false);
    const newClient = ref({
      friendlyName: '',
      iconBase64: ''
    });
    const clients = ref<Client[]>([]);

    // 初始化获取 Client 列表
    listClients().then((data: Client[]) => {
      clients.value = data;
    });

    const addClient = () => {
      // 创建新的 Client
      createClient(newClient.value.friendlyName, newClient.value.iconBase64).then((response) => {
        if (response.clientId) {
          listClients().then((data: Client[]) => {
            clients.value = data;
            showDialog.value = false;
          });
        }
      });
    };

    const deleteClient = (_clientId: string) => {
      // 这里应调用删除 API
      // 假设有一个 deleteClient() 函数来发送删除请求
      // deleteClient(clientId).then(response => {
      //   if (response.message === "Client successfully deleted.") {
      //     // 从列表中移除已删除的 Client
      //     clients.value = clients.value.filter(client => client.clientId !== clientId);
      //   }
      // });
    };

    return {
      showDialog,
      newClient,
      clients,
      addClient,
      deleteClient,
    };
  },
});
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  margin-left: 10px;
}

.title {
  margin: 0;
  margin-right: 20px;
}

.client-list {
  display: flex;
  flex-wrap: wrap;
}
.client-card {
  width: 300px;
  margin: 10px;
  border-radius: 10px;
  overflow: hidden;
}

.client-content {
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
