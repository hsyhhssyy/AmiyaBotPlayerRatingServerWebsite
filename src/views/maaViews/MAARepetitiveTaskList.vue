<template>
  <div class="task-container">
    <div class="filter-section">
    <!-- MAA连接下拉列表 -->
    <el-select v-model="selectedMaa" placeholder="请选择MAA连接" :disabled="connectionReadOnly" @change="handleMaaChange" class="filter-dropdown">
      <el-option
        v-for="item in maaOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
  </div>

    <el-table :data="tasks" stripe>
      <el-table-column prop="order" label="序号" sortable min-width="6.25%"></el-table-column>
      <el-table-column prop="id" label="任务Id" sortable min-width="31.25%" v-if="false"></el-table-column>
      <el-table-column prop="name" label="任务名称" sortable min-width="15.625%"></el-table-column>
      <el-table-column prop="type" label="任务类型" min-width="15.625%">
      <template #default="{ row }">
        {{ row.type }}
        <el-icon class="default-icon" v-if="row.parentRepetitiveTaskId!=null">
          <Timer />
        </el-icon>
      </template>
    </el-table-column>
      <el-table-column prop="availableTo" label="开始时间" sortable min-width="15.625%">
        <template #default="{ row }">
          {{ formatDate(row.availableFrom) }}
        </template>
      </el-table-column>
      <el-table-column prop="availableTo" label="结束时间" sortable min-width="15.625%">
        <template #default="{ row }">
          <div v-if="row.availableTo != null">
            {{ formatDate(row.availableTo) }}
          </div>
          <div v-if="row.availableTo == null">
            永不停止
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="availableTo" label="重复周期" sortable min-width="15.625%">
        <template #default="{ row }">
          {{ formatCron(row.utcCronString) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="30%">
        <template #default="{ row }">
            <el-button type="primary" @click="openResult(row.id)">最近结果</el-button>
            <el-button type="default" @click="allResult(row.id)">全部结果</el-button>
            <el-button type="warning" @click="pauseTask(row.id)" v-if="row.isPaused!=true">暂停</el-button>
            <el-button type="success" @click="unpauseTask(row.id)" v-if="row.isPaused==true">继续</el-button>
            <el-button type="danger" @click="deleteTask(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
        <el-config-provider :locale="zhCn">
    <el-pagination class="pagination" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
      :page-sizes="[10, 20, 50, 100]" :page-size="perPage" layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination></el-config-provider>
    <AddTaskDialog ref="addTaskDialog" />
    <TaskImageViewerDialog ref="taskImageViewerDialog" />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRoute,useRouter } from 'vue-router';
import emitter from '@src/emitter';
import AddTaskDialog from '../../components/dialogs/maaDialogs/AddTaskDialog.vue';
import TaskImageViewerDialog from '../../components/dialogs/maaDialogs/TaskImageViewerDialog.vue';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import { ElTableColumn, ElButton, ElPagination } from 'element-plus';
import { listAllConnections, addTask ,listRepetitiveTasks,addRepetitiveTask, 
  pauseRepetitiveTask,unpauseRepetitiveTask,deleteRepetitiveTask} from "@src/api/MAAConnection"
import cronstrue from 'cronstrue/i18n';

const route = useRoute();
const router = useRouter()

// 筛选条件:
const selectedMaa  = ref("");

const tasks = ref([]);
const total = ref(0);
const perPage = ref(10);
const currentPage = ref(1);
const addTaskDialog = ref<InstanceType<typeof AddTaskDialog> | null>(null)
const taskImageViewerDialog = ref<InstanceType<typeof TaskImageViewerDialog> | null>(null)


var connectionId: string = Array.isArray(route.params.connectionId)
  ? route.params.connectionId[0]
  : route.params.connectionId;
var connectionReadOnly: boolean = connectionId!=null;

// MAA连接选项
const maaOptions = ref([
  { value: 'maa1', label: 'MAA 1' },
  { value: 'maa2', label: 'MAA 2' },
  // 更多MAA选项...
]);

const handleMaaChange = async () => {

  //将所选id赋值给connectionId
  connectionId = selectedMaa.value;
  //立即刷新一次
  await fetchTasks(currentPage.value);
}

onMounted(async () => {
  // 在组件挂载后开始监听事件
  emitter.on('MAATaskListToolbar-addTask', addTaskAction);

  // 获取所有连接用于填充maaOptions下拉列表
  const allConnections = await listAllConnections();
  maaOptions.value = allConnections.map((conn: any) => {
    return {
      value: conn.id,
      label: conn.name,
    };
  });

  //根据传入connectionId默认选中一个链接
  const index = maaOptions.value.findIndex((option: any) => option.value == connectionId)
  if (index != -1) {
    selectedMaa.value = maaOptions.value[index].value
  }else{
    selectedMaa.value = maaOptions.value[0].value
  }
  
  await handleMaaChange();

  //创建一个任务,每隔20秒执行一次fetchTasks
  await fetchTasks(currentPage.value);
  setInterval(async () => {
    await fetchTasks(currentPage.value);
  }, 10000)
});

onBeforeUnmount(() => {
  // 在组件卸载前移除事件监听
  emitter.off('MAATaskListToolbar-addTask', addTaskAction);
});

const addTaskAction = async () => {
  var result = await addTaskDialog.value?.showDialog();
  if (!result) {
    return
  }

  const addedTask: any[] = []
  result.forEach(async element => {
    if (element.isPeriodic) {
      const startTime = element.startTime?.toISOString()
      const endTime = element.endTime?.toISOString()
      await addRepetitiveTask(connectionId, element.name, element.taskType,
        element.parameters, element.cronExpression, startTime, endTime)
    }else{
      const task = await addTask(connectionId, element.taskType, element.parameters)
      addedTask.push(task)
    }
  });

  await fetchTasks(currentPage.value);
}

const fetchTasks = async (_page: number) => {
  try {
    if (!connectionId) {
      return
    }
    const response = await await listRepetitiveTasks(connectionId)
    
    tasks.value = response.repetitiveTasks;
    total.value = response.total;
    currentPage.value = response.page + 1;

    tasks.value.forEach((task: any, index: number) => {
      task.order = (response.page) * perPage.value + index + 1;
    });

  } catch (error) {
    console.error('Error fetching tasks:', error);
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString();
};

const formatCron = (cronString: string) => {
  let text = cronstrue.toString(cronString, { locale: "zh_CN" });
  return text;
};

const handleSizeChange = (newSize: number) => {
  perPage.value = newSize;
  fetchTasks(1); // 重新获取第一页数据
};

const handleCurrentChange = (newPage: number) => {
  fetchTasks(newPage);
};

const openResult = async (id: string) => {
  await taskImageViewerDialog.value?.showDialog(connectionId, id, 'maaRepetitiveTasks');
};

const pauseTask = async (id: string) => {
  await pauseRepetitiveTask(connectionId, id);
  await fetchTasks(currentPage.value);
};

const unpauseTask = async (id: string) => {
  await unpauseRepetitiveTask(connectionId, id);
  await fetchTasks(currentPage.value);
};

const deleteTask = async (id: string) => {
  await deleteRepetitiveTask(connectionId, id);
  await fetchTasks(currentPage.value);
};

const allResult = (id: string) => {
  router.push({ name: '定时任务执行结果', params: { connectionId: connectionId,repetitiveTaskId:id } });
};


</script>

<style scoped>
/* 确保样式只应用于此组件 */
.task-container {
  width: calc(100% - 40px);
  /* 减去左右的margin */
}

.task-container>div:first-child {
  margin-bottom: 20px;
  font-size: 16px;
  font-weight: 600;
}

.filter-section {
  margin-bottom: 20px;
}

.filter-dropdown {
  margin-right: 10px;
}

.pagination {
  margin-top: 20px;
  text-align: center;
}
</style>

