import axios from 'axios';

interface LoginResult {
    success: boolean;
    error?: string; // 错误信息是可选的，因为如果登录成功，将没有错误信息。
}

export const loginAPI = async (email: string, password: string):Promise<LoginResult>  => {
    try {
        const response = await axios.post(import.meta.env.VITE_BACKEND_BASE_URL + '/api/account/login', {
            email,
            password,
        });

        if (response.data.token) {
            localStorage.setItem('jwt-token', response.data.token);

            const userRole = await describeAPI();
            if(userRole){
                localStorage.setItem('user-role', userRole);
            }

            return { success: true };
        }
        return { success: false, error: "登录失败" };
    } catch (error:any) {
        return { success: false, error: error.message || "未知错误" };
    }
};

export const describeAPI = async () => {
    try {
        const response = await axios.get(import.meta.env.VITE_BACKEND_BASE_URL + '/api/account/describe');
        return response.data.roles ? response.data.roles[0] : null;
    } catch (error:any) {
        return null;
    }
};

// 检查用户是否已登录
export const isLoggedIn = (): boolean => {
    const token = localStorage.getItem('jwt-token');
    const role = localStorage.getItem('user-role');
    return (!!token) && (!!role); // 双重否定将 null 或 undefined 转换为 false，有效值转换为 true
};

export const getRole = (): string|null =>{
    const role = localStorage.getItem('user-role');
    return role;
}