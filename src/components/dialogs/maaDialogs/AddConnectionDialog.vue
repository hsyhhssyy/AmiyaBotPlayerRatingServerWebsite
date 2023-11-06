<template>
  <el-dialog class="complete-connection-dialog" v-model="dialogVisible" title="创建连接" :close-on-click-modal="false" width="600px">
    <div class="dialog-content">
      <div class="dialog-row">
        <label for="connectionName" class="dialog-label">自定义名称:</label>
        <el-input v-model="connectionName" id="connectionName" placeholder="请输入连接名称"></el-input>
      </div>
      <div class="dialog-row">
        <label for="userIdentity" class="dialog-label">用户标识符:</label>
        <el-input v-model="userIdentity" id="userIdentity" readonly></el-input>
        <el-button type="primary" @click="copyUserIdentity">复制</el-button>
      </div>
      <div class="dialog-row">
        <label for="deviceIdentity" class="dialog-label">设备标识符:</label>
        <el-input v-model="deviceIdentity" id="deviceIdentity" placeholder="请输入设备标识符"></el-input>
      </div>
    </div>
    <template #footer>
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="submitIdentity">提交</el-button>
    </template>
  </el-dialog>
</template>
  
<script setup lang="ts">
import { ref } from 'vue';
import { completeConnection } from '../../../api/MAAConnection';
import { ElMessage } from 'element-plus'

const dialogVisible = ref(false);
const userIdentity = ref('');
const connectionId = ref('');
const deviceIdentity = ref('');
const connectionName = ref('');

// 用于解析对话框关闭时的Promise
let resolveDialog: ((value: boolean | PromiseLike<boolean>) => void) | null = null;

const cancel = () => {
  dialogVisible.value = false;
  resolveDialog && resolveDialog(false);
};

const copyUserIdentity = async () => {
  await navigator.clipboard.writeText(userIdentity.value);
  ElMessage.success(`复制成功`);
};

const submitIdentity = () => {
  if (deviceIdentity.value.trim() === '') {
    ElMessage.error(`请输入设备标识符`);
    return;
  }

  if (connectionName.value.trim() === '') {
    ElMessage.error(`请输入连接名称`);
    return;
  }

  completeConnection(connectionId.value,deviceIdentity.value,connectionName.value).then(() => {
    dialogVisible.value = false;
    resolveDialog && resolveDialog(true);
  }).catch((error:any) => {
    ElMessage.error(`连接列表获取失败: ${error.message}`);
  });
};

const showDialog = (id:string, userIdentityValue: string) => {
  return new Promise<boolean>((resolve) => {
    resolveDialog = resolve;
    dialogVisible.value = true;
    userIdentity.value = userIdentityValue;
    connectionId.value = id;
  });
};

defineExpose({ showDialog });

</script>
  
<style scoped>
.complete-connection-dialog {
  border-radius: 20px;
}

.dialog-content {
  margin: 0;
  padding: 20px;
}

.dialog-row {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.dialog-label {
  margin-right: 10px;
  min-width: 100px;
}

.el-input,
.el-button {
  margin-right: 10px;
}

/* 根据实际需要调整样式 */
</style>
  