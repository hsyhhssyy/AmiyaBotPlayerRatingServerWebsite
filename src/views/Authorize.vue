<template>
    <div>
      <h1>OAuth Authorization</h1>
      <p>Client ID: {{ clientId }}</p>
      <p>Redirect URL: {{ redirectUrl }}</p>
      <p>State: {{ state }}</p>
      <button @click="authorize">Authorize</button>
    </div>
  </template>
  
  <script lang="ts">
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  
  export default {
    setup() {
      const router = useRouter();
      const clientId = ref<string>(router.currentRoute.value.query.client_id as string || '');
      const redirectUrl = ref<string>(router.currentRoute.value.query.redirect_url as string || '');
      const state = ref<string>(router.currentRoute.value.query.state as string || '');
  
      const authorize = () => {
        // 处理授权逻辑，例如与你的后端 API 通信
      };
  
      return {
        clientId,
        redirectUrl,
        state,
        authorize,
      };
    },
  };
  </script>
  