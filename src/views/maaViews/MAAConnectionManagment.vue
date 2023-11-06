<template>
  <div>
    <div class="header">
      <h1 class="title">连接管理</h1>
      <el-button type="primary" @click="addConnection">创建连接</el-button>
    </div>
    <div class="connection-list">
      <ConnectionCard v-for="connection in connections" :key="connection.id" :connection="connection" :delete-connection="deleteConnectionById"/>
    </div>
    <AddConnectionDialog ref="addConnectionDialog" />
  </div>
</template>
  
<script setup lang="ts">
import { ref, Ref } from 'vue';
import ConnectionCard, { MAAConnection } from '../../components/cards/maa/MAAConnectionCard.vue';
import { listAllConnections, initializeConnection, deleteConnection } from '../../api/MAAConnection';
import AddConnectionDialog from '../../components/dialogs/maaDialogs/AddConnectionDialog.vue';
import { ElMessage } from 'element-plus'



const connections: Ref<MAAConnection[]> = ref([]);
const addConnectionDialog = ref<InstanceType<typeof AddConnectionDialog> | null>(null)

// 初始化获取连接列表
listAllConnections().then((data) => {
  connections.value = data;
}).catch((error) => {
  ElMessage.error(`连接列表获取失败: ${error.message}`);
});

const addConnection = async () => {

  try {
    const response = await initializeConnection();
    if (response.id) {
      var result = await addConnectionDialog.value?.showDialog(response.id, response.userIdentity);
      if (result) {
        ElMessage.success('创建成功');
        await listAllConnections().then((data) => {
          connections.value = data;
        }).catch((error) => {
          ElMessage.error(`连接列表获取失败: ${error.message}`);
        });
      }
    }
  } catch (error: any) {
    ElMessage.error(`创建失败: ${error.message}`);
  }
};


const deleteConnectionById = async (id: string) => {
  try {
    await deleteConnection(id);
    ElMessage.success('删除连接成功');
    connections.value = connections.value.filter((connection) => connection.id !== id);
  } catch (error:any) {
    ElMessage.error(`删除连接失败: ${error.message}`);
  }
};
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

.connection-list {
  display: flex;
  flex-wrap: wrap;
}
</style>
  