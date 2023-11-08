<template>
  <el-dialog title="任务设置" v-model="dialogVisible" :close-on-click-modal="false" width="700px">
    <div class="dialog-content">
      <div class="dialog-row">
        <label for="taskType" class="dialog-label">任务类型:</label>
        <el-select v-model="taskType" id="taskType" placeholder="请选择" @change="handleTaskTypeChange">
          <el-option label="截图任务 (CaptureImage)" value="CaptureImage"></el-option>
          <el-option label="启动一键长草任务 (LinkStart)" value="LinkStart"></el-option>
          <el-option label="单次抽卡任务 (Toolbox-GachaOnce)" value="Toolbox-GachaOnce"></el-option>
          <el-option label="十连抽卡任务 (Toolbox-GachaTenTimes)" value="Toolbox-GachaTenTimes"></el-option>
          <el-option label="修改连接地址设置 (Settings-ConnectionAddress)" value="Settings-ConnectionAddress"></el-option>
          <el-option label="立即截图任务 (CaptureImageNow)" value="CaptureImageNow"></el-option>
          <el-option label="结束当前任务 (StopTask)" value="StopTask"></el-option>
          <el-option label="一键长草-基建任务 (LinkStart-Base)" value="LinkStart-Base"></el-option>
          <el-option label="一键长草-唤醒任务 (LinkStart-WakeUp)" value="LinkStart-WakeUp"></el-option>
          <el-option label="一键长草-战斗任务 (LinkStart-Combat)" value="LinkStart-Combat"></el-option>
          <el-option label="一键长草-公招任务 (LinkStart-Recruiting)" value="LinkStart-Recruiting"></el-option>
          <el-option label="一键长草-商店购物任务 (LinkStart-Mall)" value="LinkStart-Mall"></el-option>
          <el-option label="一键长草-领取奖励任务 (LinkStart-Mission)" value="LinkStart-Mission"></el-option>
          <el-option label="一键长草-自动肉鸽任务 (LinkStart-AutoRoguelike)" value="LinkStart-AutoRoguelike"></el-option>
          <el-option label="一键长草-生息演算任务 (LinkStart-ReclamationAlgorithm)"
            value="LinkStart-ReclamationAlgorithm"></el-option>
        </el-select>
      </div>
      <div class="dialog-row" v-if="false">
        <label for="linkStartCombatStage" class="dialog-label">战斗关卡:</label>
        <el-select v-model="linkStartCombatStage" id="linkStartCombatStage" placeholder="请选择关卡">
          <el-option label="1-7" value="1-7"></el-option>
          <el-option label="CE-6" value="CE-6"></el-option>
          <el-option label="ZT-8" value="ZT-8"></el-option>
          <el-option label="ZT-9" value="ZT-9"></el-option>
          <el-option label="ZT-10" value="ZT-10"></el-option>
        </el-select>
      </div>
      <div class="dialog-row" v-if="taskType === 'Settings-ConnectionAddress'">
        <label for="settingsConnectionAddressStr" class="dialog-label">连接地址:</label>
        <el-input v-model="settingsConnectionAddressStr" id="settingsConnectionAddressStr" placeholder="请输入连接地址"></el-input>
      </div>
    </div>
    <template #footer>
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="submitForm">提交</el-button>
    </template>
  </el-dialog>
</template>
  
<script setup lang="ts">
import { ref } from 'vue';

const dialogVisible = ref(false);
const taskType = ref('');
const linkStartCombatStage = ref('');
const settingsConnectionAddressStr = ref('');

interface CreateTaskData{
  taskType: string;
  parameters:string;
}

// 处理任务类型变化的函数
const handleTaskTypeChange = (value: string) => {
  taskType.value = value
}

const cancel = () => {
    dialogVisible.value = false;
    resolveDialog && resolveDialog(null);
  };

// 表单提交的函数
const submitForm = () => {  

  const dataToReturn: CreateTaskData = {
    taskType: taskType.value,
    parameters: ''
  }

  switch(taskType.value){
    case 'Settings-ConnectionAddress':
      dataToReturn.parameters = settingsConnectionAddressStr.value;
      break;
    default:
      break;
  }

  if (validateForm(dataToReturn)) {
    dialogVisible.value = false
    resolveDialog && resolveDialog([dataToReturn]);
  } else {
    
  }
}

// 假设的表单验证函数
const validateForm = (data:CreateTaskData): boolean => {
  if(!data.taskType){
    return false;
  }
  return true
}

// 用于解析对话框关闭时的Promise
let resolveDialog: ((value: CreateTaskData[] | PromiseLike<CreateTaskData[]> | null ) => void) | null = null;

const showDialog = () => {
  return new Promise<CreateTaskData[]|null>((resolve) => {
    resolveDialog = resolve;
    dialogVisible.value = true;
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
.el-select{
  margin-right: 10px;
  width: 100%;
}

.el-button {
  margin-right: 10px;
}
/* 根据实际需要调整样式 */
</style>