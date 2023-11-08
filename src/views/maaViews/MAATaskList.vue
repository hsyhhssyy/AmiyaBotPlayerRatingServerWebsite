<template>
  <div class="task-container">
    <div>当前连接: {{ connectionName }}</div>
    <el-table :data="tasks" stripe>
      <el-table-column prop="order" label="序号" sortable min-width="6.25%"></el-table-column>
      <el-table-column prop="id" label="任务Id" sortable min-width="31.25%" v-if="false"></el-table-column>
      <el-table-column prop="type" label="任务类型" min-width="15.625%"></el-table-column>
      <el-table-column prop="createdAt" label="发出时间" sortable min-width="15.625%">
        <template #default="{ row }">
          {{ formatDate(row.createdAt) }}
        </template>
      </el-table-column>
      <el-table-column prop="completedAt" label="完成时间" sortable  min-width="15.625%">
        <template #default="{ row }">
        <div v-if="row.isCompleted==true">
          {{ formatDate(row.completedAt) }}
        </div>
        </template>
      </el-table-column>
      <el-table-column prop="result" label="执行结果"  min-width="7.8125%">
        <template #default="{ row }">
          <el-tag :type="row.isCompleted == true ? 'success' : 'danger'">{{ row.isCompleted == true ? '成功' : '进行中' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="查看结果" min-width="7.8125%">
        <template #default="{ row }">
        <div v-if="row.isCompleted==true">
          <el-button type="text" @click="openResult(row.id)">查看结果</el-button>
        </div>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="perPage"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
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
import { ElTableColumn, ElTag, ElButton, ElPagination } from 'element-plus';
import { getConnection,listTasks,addTask } from "@src/api/MAAConnection"

const route = useRoute();
const connectionId: string = Array.isArray(route.params.connectionId) 
  ? route.params.connectionId[0] 
  : route.params.connectionId;

const connectionName = ref("");

const tasks = ref([]);
const total = ref(0);
const perPage = ref(10);
const currentPage = ref(1);
const addTaskDialog = ref<InstanceType<typeof AddTaskDialog> | null>(null)
const taskImageViewerDialog = ref<InstanceType<typeof TaskImageViewerDialog> | null>(null)

onMounted(async () => {
  // 在组件挂载后开始监听事件
  emitter.on('MAATaskListToolbar-addTask', addTaskAction);
  var conn = await getConnection(connectionId);
  connectionName.value = conn.name;
  await fetchTasks(currentPage.value);

  //创建一个任务,每隔20秒执行一次上面的fetchTasks
  setInterval(async ()=>{
    await fetchTasks(currentPage.value);
  },10000)
});

onBeforeUnmount(() => {
  // 在组件卸载前移除事件监听
  emitter.off('MAATaskListToolbar-addTask', addTaskAction);
});

const addTaskAction = async ()=>{
  var result = await addTaskDialog.value?.showDialog();
  if(!result){
    return
  }

  const addedTask:any[] = []
  result.forEach(async element => {
    const task = await addTask(connectionId,element.taskType,element.parameters)
    addedTask.push(task)
  });

  await fetchTasks(currentPage.value,addedTask);
}

const fetchTasks = async (page: number, addedTask:any[] = []) => {
  try {
    const response = await listTasks(connectionId, page-1, perPage.value);

    if(page==1){
      //判断addedTask是不是在列表中，如果不在则插入到第一个，并删掉最后一个
      addedTask.forEach(element => {
        const index = response.tasks.findIndex((task:any)=>task.id==element.id)
        if(index==-1){
          response.tasks.unshift(element)
          response.tasks.pop()
        }
      });
    }

    tasks.value = response.tasks;
    total.value = response.maxPage * perPage.value;
    currentPage.value = response.page+1;

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
  await taskImageViewerDialog.value?.showDialog(connectionId,id);
};


</script>

<style scoped>
/* 确保样式只应用于此组件 */
.task-container {
  margin: 20px;
  width: calc(100% - 40px); /* 减去左右的margin */
}

.task-container > div:first-child {
  margin-bottom: 20px;
  font-size: 16px;
  font-weight: 600;
}

.el-table {
  width: 100%;
  max-width: 100%; /* 确保即使屏幕缩放，也能占满 */
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
.el-table td, .el-table th {
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

