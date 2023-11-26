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

    <!-- 周期任务下拉列表 -->
    <el-select v-model="selectedTask" placeholder="请选择周期任务" 
      :disabled="!selectedMaa||repetitiveReadOnly" @change="handleRepetitiveTaskChange"  class="filter-dropdown"
      clearable>
      <el-option
        v-for="task in taskOptions"
        :key="task.value"
        :label="task.label"
        :value="task.value">
      </el-option>
    </el-select>
  </div>

    <el-table :data="tasks" stripe>
      <el-table-column prop="order" label="序号" sortable min-width="6.25%"></el-table-column>
      <el-table-column prop="id" label="任务Id" sortable min-width="31.25%" v-if="false"></el-table-column>
      <el-table-column prop="type" label="任务类型" min-width="15.625%">
      <template #default="{ row }">
        {{ row.type }}
        <el-icon class="default-icon" v-if="row.parentRepetitiveTaskId!=null">
          <Timer />
        </el-icon>
      </template>
    </el-table-column>
      <el-table-column prop="createdAt" label="发出时间" sortable min-width="15.625%">
        <template #default="{ row }">
          {{ formatDate(row.createdAt) }}
        </template>
      </el-table-column>
      <el-table-column prop="completedAt" label="完成时间" sortable min-width="15.625%">
        <template #default="{ row }">
          <div v-if="row.isCompleted == true">
            {{ formatDate(row.completedAt) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="result" label="执行结果" min-width="7.8125%">
        <template #default="{ row }">
          <el-tag :type="row.isCompleted == true ? 'success' : 'danger'">{{ row.isCompleted == true ? '成功' : '进行中'
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="7.8125%">
        <template #default="{ row }">
          <div v-if="row.isCompleted == true">
            <el-button type="default" @click="openResult(row.id)">查看结果</el-button>
          </div>
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
import { useRoute } from 'vue-router';
import emitter from '@src/emitter';
import AddTaskDialog from '../../components/dialogs/maaDialogs/AddTaskDialog.vue';
import TaskImageViewerDialog from '../../components/dialogs/maaDialogs/TaskImageViewerDialog.vue';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import { ElTableColumn, ElTag, ElButton, ElPagination } from 'element-plus';
import { listAllConnections, listTasks, addTask ,listRepetitiveTasks,addRepetitiveTask} from "@src/api/MAAConnection"

const route = useRoute();

// 筛选条件:
const selectedMaa  = ref("");
const selectedTask = ref<string|null>("");

const tasks = ref([]);
const total = ref(0);
const perPage = ref(10);
const currentPage = ref(1);
const addTaskDialog = ref<InstanceType<typeof AddTaskDialog> | null>(null)
const taskImageViewerDialog = ref<InstanceType<typeof TaskImageViewerDialog> | null>(null)


var connectionId: string = Array.isArray(route.params.connectionId)
  ? route.params.connectionId[0]
  : route.params.connectionId;
var repetitiveTaskId: string | null = Array.isArray(route.params.repetitiveTaskId)
  ? route.params.repetitiveTaskId[0]
  : route.params.repetitiveTaskId;
var connectionReadOnly: boolean = connectionId!=null;
var repetitiveReadOnly: boolean = repetitiveTaskId!=null;

// MAA连接选项
const maaOptions = ref([
  { value: 'maa1', label: 'MAA 1' },
  { value: 'maa2', label: 'MAA 2' },
  // 更多MAA选项...
]);

// 所有可能的周期任务选项
const taskOptions = ref([
  { value: 'task1', label: '任务 1'},
  { value: 'task2', label: '任务 2'},
  { value: 'task3', label: '任务 3'},
  // 更多任务选项...
]);

const handleMaaChange = async () => {
  //将所选id赋值给connectionId
  connectionId = selectedMaa.value
  selectedTask.value = null; // 当MAA变更时，重置周期任务选择
  //立即刷新一次
  await fetchTasks(currentPage.value);
}

const handleRepetitiveTaskChange = async () => {
  //将所选id赋值给repetitiveTaskId
  repetitiveTaskId = selectedTask.value
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
  }

  await fetchTasks(currentPage.value);

  const repIndex = taskOptions.value.findIndex((option: any) => option.value == repetitiveTaskId)
  if (index != -1) {
    selectedTask.value = taskOptions.value[repIndex].value
  }

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

  await fetchTasks(currentPage.value, addedTask);
}

const fetchTasks = async (page: number, addedTask: any[] = []) => {
  try {
    const response = await listTasks(connectionId, repetitiveTaskId, page - 1, perPage.value);

    if (page == 1) {
      //判断addedTask是不是在列表中，如果不在则插入到第一个，并删掉最后一个
      addedTask.forEach(element => {
        const index = response.tasks.findIndex((task: any) => task.id == element.id)
        if (index == -1) {
          response.tasks.unshift(element)
          response.tasks.pop()
        }
      });
    }

    tasks.value = response.tasks;
    total.value = response.total;
    currentPage.value = response.page + 1;

    tasks.value.forEach((task: any, index: number) => {
      task.order = (response.page) * perPage.value + index + 1;
    });

    //获取任务用来填充taskOptions
    const repetitiveTask = await listRepetitiveTasks(connectionId)
    taskOptions.value = repetitiveTask.repetitiveTasks.map((task: any) => {
      return {
        value: task.id,
        label: task.name
      };
    });

  } catch (error) {
    console.error('Error fetching tasks:', error);
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString();
};

const handleSizeChange = (newSize: number) => {
  perPage.value = newSize;
  fetchTasks(1); // 重新获取第一页数据
};

const handleCurrentChange = (newPage: number) => {
  fetchTasks(newPage);
};

const openResult = async (id: string) => {
  await taskImageViewerDialog.value?.showDialog(connectionId, id);
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

