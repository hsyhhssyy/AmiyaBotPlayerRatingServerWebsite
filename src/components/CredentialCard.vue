<template>
  <el-card :class="{ 'cred-card': true, 'selected': isSelected }">
    <div class="cred-content">
      <img :src="cred.avatarUrl" class="avatar" />
      <div class="text-content">
        <div class="nickname">{{ cred.nickname }}</div>
        <div class="uid">{{ cred.id }}</div>
      </div>
      <el-button class="delete-icon" v-if="deleteCred" @click="deleteCred(cred.id)">
        <el-icon>
          <Delete />
        </el-icon>
      </el-button>
    </div>
  </el-card>
</template>
  
<script lang="ts">
import { defineComponent, PropType } from 'vue';

export interface Cred {
  id: string;
  nickname: string;
  avatarUrl: string;
}

export default defineComponent({
  props: {
    cred: {
      type: Object as PropType<Cred>,
      required: true
    },
    deleteCred: {
      type: Function as PropType<(id: string) => void>,
      required: false
    },
    isSelected: {
      type: Boolean,
      required: false,
      default: false,
    },
  }
});
</script>
  
<style scoped>
/* 样式与之前的保持一致 */
.cred-card {
  width: 300px;
  margin: 10px;
  border-radius: 10px;
  overflow: hidden;
}

.cred-content {
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

.selected {
  border: 2px solid green;
  /* 选中时的边框 */
}
</style>
  