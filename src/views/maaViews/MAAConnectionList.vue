<template>
  <div>
    <div class="connection-list">
      <ConnectionCard v-for="connection in connections" :key="connection.id" :connection="connection" 
        :delete-connection="deleteConnectionById" @click="cardClick(connection)"/>
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
import { onMounted, onBeforeUnmount } from 'vue';
import emitter from '@src/emitter';
import { useRouter } from 'vue-router'

const connections: Ref<MAAConnection[]> = ref([]);
const addConnectionDialog = ref<InstanceType<typeof AddConnectionDialog> | null>(null)
const router = useRouter()

// 初始化获取连接列表
listAllConnections().then((data) => {
  connections.value = data;
}).catch((error) => {
  ElMessage.error(`连接列表获取失败: ${error.message}`);
});

onMounted(() => {
  // 在组件挂载后开始监听事件
  emitter.on('MAAConnectionListToolbar-addConnection', addConnection);
});

onBeforeUnmount(() => {
  // 在组件卸载前移除事件监听
  emitter.off('MAAConnectionListToolbar-addConnection', addConnection);
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

const cardClick = (connection: any) => {
  router.push({ name: '任务列表', params: { connectionId: connection.id } });
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

.connection-list {
  display: flex;
  flex-wrap: wrap;
}
</style>
  