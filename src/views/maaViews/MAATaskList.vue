<template>
  <div>
    <h1>MAATaskListFor:{{ connectionId }}</h1>
  </div>
</template>
  
<script lang="ts" setup>
import { useRoute } from 'vue-router'

const route = useRoute();
const connectionId = route.params.connectionId;



</script>
  
<style scoped>
/* 样式（如果有的话） */
</style>
  