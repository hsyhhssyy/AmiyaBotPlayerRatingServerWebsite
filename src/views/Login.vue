<template>
    <div class="login-container">
        <el-card class="login-card">
            <div slot="header">
                <h1>兔兔用户中心</h1>
            </div>
            <p class="disclaimer">本网站<b style="color: red;">不是</b>鹰角网络下属的官方网站。</p>
            <el-form>
                <el-form-item label="邮箱：">
                    <el-input v-model="email" placeholder="Email"></el-input>
                </el-form-item>
                <el-form-item label="密码：">
                    <el-input type="password" v-model="password" placeholder="Password"></el-input>
                </el-form-item>
                <el-form-item>
                    <div class="button-container">
                        <el-button type="primary" @click="login">登录</el-button>
                        <el-button type="secondary" @click="register">注册</el-button>
                    </div>
                </el-form-item>
            </el-form>
            <div class="footer">
                <p>本网站不是鹰角网络官方网站，而是由爱好者自行开发的工具网站。</p>
            </div>
        </el-card>
    </div>
</template>
  
<script lang="ts">
import { ref } from 'vue';
import {ElMessage} from 'element-plus';
import { useRouter } from 'vue-router';
import { loginAPI } from '../api/Account';

export default {
    setup() {
        const router = useRouter();
        const email = ref('');
        const password = ref('');

        const login = async () => {
            const { success, error } = await loginAPI(email.value, password.value);
            if (success) {
                router.push('/');
            } else {
                ElMessage.error(error || '登录失败');
            }
        };

        const register = () => {
            router.push('/register');
        };

        return {
            email,
            password,
            login,
            register,
        };
    },
};
</script>
  
<style scoped>
.login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
}

.login-card {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.1);
    width: 400px;
    text-align: center;
}

.disclaimer {
    font-size: 14px;
    color: gray;
    text-align: center;
    margin-bottom: 20px;
}

.button-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
}

.footer {
    text-align: center;
    font-size: 14px;
    color: gray;
}

</style>