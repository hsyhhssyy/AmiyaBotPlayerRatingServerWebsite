<template>
     <el-dialog v-model="localShowDialog">
      <div>
        <h3>请复制并保存以下应用Id和Secret</h3>
        <p>警告：关闭对话框后将无法再次查看该应用对应的Secret。请不要泄露Secret给任何第三方。</p>
        <label for="clientId">应用Id:</label>
        <div id="clientId" class="client-secret">{{ clientId }}</div>
        <label for="clientSecret">应用Secret:</label>
        <div id="clientSecret" class="client-secret">{{ clientSecret }}</div>
      </div>
      <template #footer>
        <el-button @click="localShowDialog = false">已复制，关闭</el-button>
      </template>
    </el-dialog>
</template>
  
<script setup lang="ts">
import { ref, defineProps, defineEmits, watch } from 'vue';

// 接收来自父组件的 props
const props = defineProps<{
    modelValue: boolean;
    clientId: string;
    clientSecret: string;

}>();

// 定义向父组件发送事件的 emit 函数
const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void
}>();

const localShowDialog = ref(false);

watch(() => props.modelValue, (newValue: any) => {
    localShowDialog.value = newValue;
});

watch(localShowDialog, (newVal: boolean) => {
    if (props.modelValue != newVal) {
        emit('update:modelValue', newVal)
    }
})

</script>
  
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
  
  