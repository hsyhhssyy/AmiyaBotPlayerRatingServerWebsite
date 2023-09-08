<template>
    <div>
        <h1>Login</h1>
        <input v-model="email" placeholder="Email" />
        <input type="password" v-model="password" placeholder="Password" />
        <button @click="login">Login</button>
    </div>
</template>
  
<script lang="ts">
import { ref } from 'vue';
import axios from 'axios';

export default {
    setup() {
        const email = ref('');
        const password = ref('');

        const login = async () => {
            try {
                const response = await axios.post(import.meta.env.VITE_BACKEND_BASE_URL+'/api/account/login', {
                    email: email.value,
                    password: password.value,
                });

                if (response.data.token) {
                    localStorage.setItem('jwt-token', response.data.token);
                    router.push('/');
                }
            } catch (error) {
                console.error("An error occurred while logging in:", error);
            }
        };

        return {
            email,
            password,
            login,
        };
    },
};
</script>
  