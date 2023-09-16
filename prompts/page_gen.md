<template>
  <el-container class="oauth-page">
    <el-main class="main-content">
      <el-card class="box-card">

        <div slot="header">
          <h1 style="text-align: center;">森空岛凭据管理中心</h1>
        </div>
        <div class="app-info">
          <el-avatar :src="appIcon" size="large"></el-avatar>
          <!-- 增加一个容器以垂直排列名称和描述 -->
          <div class="info-text">
            <div class="name">{{ clientInfo.FriendlyName }}</div>
            <div class="description">{{ appDescription }}</div>
          </div>
        </div>
        <el-divider></el-divider>
        <el-alert title="该应用想要授权获取您的干员列表。" type="warning" show-icon :closable="false" class="custom-alert"></el-alert>

        <!-- 登陆前 -->
        <div v-if="!isLoggedIn">
          <el-alert title="您还没有登录，请先登录：" type="warning" show-icon :closable="false" class="custom-alert"></el-alert>
          <label for="username">邮箱:</label>
          <el-input id="username" v-model="username" placeholder="请输入用户名" class="input-margin"></el-input>

          <label for="password">密码:</label>
          <el-input id="password" v-model="password" type="password" placeholder="请输入密码" class="input-margin"></el-input>

          <el-button type="primary" @click="login" class="button-margin">登录</el-button>
          <el-button type="secondary" @click="login" class="button-margin">我还没有账户，立刻注册</el-button>

        </div>

        <!-- 登陆后 -->
        <div v-else>
          <div class="cred-list">
          <CredCard
            v-for="cred in creds"
            :key="cred.id"
            :cred="cred"
          />
        </div>
          <el-divider></el-divider>
          <el-button type="success" @click="authorize(true)">同意</el-button>
          <el-button type="danger" @click="authorize(false)">拒绝</el-button>
        </div>
      </el-card>
    </el-main>
  </el-container>
</template>
  
<script lang="ts">
import { ref, onMounted, computed, watchEffect } from 'vue';
import { ElMessage, ElAlert, ElAvatar, ElDivider } from 'element-plus';
import { getClient } from '../api/Client';
import { isLoggedIn, getRole } from '../api/Account';
import CredCard,{ Cred } from '../components/CredentialCard.vue';
import { getCredentials } from '../api/SKLandCredential';

export default {
  components: {
    ElAlert,
    ElAvatar,
    ElDivider,
    CredCard,
  },
  setup() {
    const appIcon = computed(() => `data:image/png;base64,${clientInfo.value.IconBase64}`);
    const appDescription = computed(() => clientInfo.value.Description);

    const isUserLoggedIn = ref(false);
    const playerAvatar = ref('');
    const username = ref('');
    const password = ref('');

    const creds = ref<Cred[]>([]);
    const selectedCred = ref(null);

    const clientInfo = ref({
      ClientId: '',
      FriendlyName: '',
      Description: '',
      IconBase64: ''
    });

    const selectCred = (cred) => {
  selectedCred.value = cred;
};

    const fetchClientInfo = async () => {
      try {
        const clientId = new URLSearchParams(window.location.search).get('client-id');
        if (clientId) {
          const response = await getClient(clientId);
          if (response) {
            clientInfo.value.ClientId = response.clientId || '';
            clientInfo.value.FriendlyName = response.friendlyName || '';
            clientInfo.value.Description = response.description || '';
            clientInfo.value.IconBase64 = response.iconBase64 || '';
          }
        } else {
          ElMessage.error('client-id 参数缺失');
        }
      } catch (error) {
        ElMessage.error('获取客户端信息失败');
      }
    };

    onMounted(async ()=>{
      fetchClientInfo();

      await checkAndRefresh();
    });

    const checkAndRefresh = async ()=>{
      var ret =  isLoggedIn() && getRole() === "普通账户"; // 每当组件更新时检查

      if(ret){
        creds.value = await getCredentials();
      }
      isUserLoggedIn.value = ret
      return ret
    }

    //检查是否Login
    watchEffect(() => {
      checkAndRefresh()
    });

    const login = async () => {

    };

    const authorize = async (isAuthorized: boolean) => {
      if(isAuthorized){

      }
    };

    const openRegisterPage = () => {
      window.open('/register', '_blank');
    };

    return {
      appIcon,
      appDescription,
      creds,
      isLoggedIn,
      selectedCred,
      playerAvatar,
      username,
      password,
      clientInfo,
      login,
      authorize,
      openRegisterPage,
      fetchClientInfo,
    };
  },
};
</script>
  
<style scoped>
.app-info {
  display: flex;
  align-items: center;
  /* 垂直居中 */
}

.info-text {
  margin-left: 20px;
}

.name {
  font-size: 1.2em;
  /* 或者你喜欢的任何其他大小 */
}

.description {
  font-size: 0.8em;
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

.oauth-page {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.main-content {
  width: 100%;
  max-width: 500px;
}

.custom-alert {
  margin: 10px 0;
}

.box-card {
  padding: 20px;
}

.input-margin {
  margin-bottom: 10px;
  /* 下方外边距为10px */
}

.button-margin {
  margin-top: 10px;
  /* 上方外边距为10px */
}

.cred-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;  /* 水平居中 */
}
</style>

能否让这里面的CredCard可以选择?单选.只有一个则默认选中.
然后只有选择了一项的时候同意才能亮起.