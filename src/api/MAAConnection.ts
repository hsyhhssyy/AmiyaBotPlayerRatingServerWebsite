import axios from 'axios';

const BASE_URL = '/api/MAAConnection';

export const listAllConnections = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/List`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('jwt-token')}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('An error occurred while listing all connections: ', error);
        throw error;
    }
};

export const initializeConnection = async () => {
    try {
        const response = await axios.post(`${BASE_URL}/Initialize`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('jwt-token')}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('发生异常: ', error);
        throw error;
    }
};

export const completeConnection = async (id: string, deviceIdentity: string, name:string) => {
    try {
        const response = await axios.post(`${BASE_URL}/Complete/${id}`, {
            DeviceIdentity: deviceIdentity,
            Name: name
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('jwt-token')}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error(`发生异常 ${id}: `, error);
        throw error;
    }
};

export const deleteConnection = async (id: string) => {
    try {
        const response = await axios.delete(`${BASE_URL}/Delete/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('jwt-token')}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error(`发生异常(id=${id}): `, error);
        throw error;
    }
};

export default {
    listAllConnections,
    initializeConnection,
    completeConnection,
    deleteConnection
};
