import axios from 'axios';

// 获取 Cred 列表
export const getCredentials = async () => {
  try {
    const response = await axios.get('/api/SKLandCredential/List', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('jwt-token')}`, 
      },
    });
    return response.data;
  } catch (error) {
    console.error('An error occurred while fetching data: ', error);
  }
};

// 创建新的 Cred
export const createCredential = async (cred: string) => {
  try {
    const response = await axios.post(
      '/api/SKLandCredential/Create',
      {
        // 将 cred 对象传递到请求体
        Credential:cred,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt-token')}`, 
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('An error occurred while creating data: ', error);
  }
};

export const deleteCredential = async (credId: string) => {
  try {
    const response = await axios.delete(
      `/api/SKLandCredential/Delete/${credId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt-token')}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('An error occurred while delete data: ', error);
  }
};
