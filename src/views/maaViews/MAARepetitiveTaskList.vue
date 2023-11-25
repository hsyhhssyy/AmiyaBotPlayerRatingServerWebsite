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
            {{row.utcCronString}}
        </template>
      </el-table-column>
      <el-table-column label="查看结果" min-width="7.8125%">
        <template #default="{ row }">
            <el-button type="text" @click="openResult(row.id)">最近一次</el-button>
            <el-button type="text" @click="openResult(row.id)">全部任务</el-button>
        </template>
      </el-table-column>
    </el-table>
        <el-config-provider :locale="zhCn">
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
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
import { ElTableColumn, ElButton, ElPagination } from 'element-plus';
import { listAllConnections, addTask ,listRepetitiveTasks,addRepetitiveTask} from "@src/api/MAAConnection"

const route = useRoute();

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
  }

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


.data-table {
  /* 数据表格的特定样式 */
}

.el-table {
  width: 100%;
  max-width: 100%;
  /* 确保即使屏幕缩放，也能占满 */
  --el-border-color: #e4e7ed;
  --el-border-style: solid;
  --el-border-width: 1px;
}

.el-table .el-table__header-wrapper {
  background-color: #f5f7fa;
}

.el-table .el-table__row:hover {
  background-color: #ecf5ff;
}

.el-tag {
  cursor: pointer;
}

.el-pagination {
  margin-top: 20px;
  text-align: center;
}

.el-button {
  color: #409eff;
  text-decoration: underline;
  cursor: pointer;
}

/* 调整分页器大小选择器和跳转器的样式 */
.el-pagination .el-pagination__sizes,
.el-pagination .el-pagination__jump {
  display: flex;
  align-items: center;
}

/* 样式调整，以便看起来更加紧凑 */
.el-pagination .el-pagination__sizes .el-select {
  width: auto;
}

.el-pagination .el-pagination__jump {
  margin-left: 15px;
}

/* 设置表格内边距和字体大小 */
.el-table td,
.el-table th {
  padding: 8px 0;
  font-size: 14px;
}

/* 修正按钮的高度，以便和文本对齐 */
.el-button {
  height: auto;
  padding: 0;
  line-height: inherit;
}
</style>

