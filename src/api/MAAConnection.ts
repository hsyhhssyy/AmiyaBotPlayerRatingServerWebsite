import axios from 'axios';

const BASE_URL = '/api/maaConnections';

export const listAllConnections = async () => {
    try {
        const response = await axios.get(`${BASE_URL}`, {
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

export const getConnection = async (connId:string) => {
    try {
        const response = await axios.get(`${BASE_URL}/${connId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('jwt-token')}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error(`发生异常(id=${connId}): `, error);
        throw error;
    }
}

export const initializeConnection = async () => {
    try {
        const response = await axios.post(`${BASE_URL}`, {
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
        const response = await axios.patch(`${BASE_URL}/${id}`, {
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
        const response = await axios.delete(`${BASE_URL}/${id}`, {
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

export const listTasks = async (connId: string, repetitiveTaskId:string|null, page: number,size:number) => {
    try {
        const queryUrl = `${BASE_URL}/${connId}/maaTasks?page=${page}&size=${size}`+(repetitiveTaskId?`&repetitiveTaskId=${repetitiveTaskId}`:'');
        const response = await axios.get(queryUrl, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('jwt-token')}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error(`发生异常(id=${connId}): `, error);
        throw error;
    }
};

export const getConnectionThumbnail = async (connId: string) => {
    try {
        const response = await axios.get(`${BASE_URL}/${connId}/image?type=thumbnail`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('jwt-token')}`,
            },
        });
        return response.data.image;
    } catch (error) {
        console.error(`发生异常(id=${connId}): `, error);
        throw error;
    }
};

export const getTaskImage = async (connId: string,taskId: string) => {
    try {
        const response = await axios.get(`${BASE_URL}/${connId}/maaTasks/${taskId}/image`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('jwt-token')}`,
            },
        });
        return response.data.image;
    } catch (error) {
        console.error(`发生异常(id=${connId}): `, error);
        throw error;
    }
};

export const addTask = async (connId: string,type: string,parameters:string) => {
    try {
        const response = await axios.post(`${BASE_URL}/${connId}/maaTasks`, 
        {
            type:type,
            parameters:parameters
        }
        ,{
            headers: {
                Authorization: `Bearer ${localStorage.getItem('jwt-token')}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error(`发生异常(id=${connId}): `, error);
        throw error;
    }
};

export const listRepetitiveTasks = async (connId: string) => {
    try {
        const response = await axios.get(`${BASE_URL}/${connId}/maaRepetitiveTasks`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('jwt-token')}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error(`发生异常(id=${connId}): `, error);
        throw error;
    }
}

export const addRepetitiveTask = async (connId: string,
    name: string,
    type: string,
    parameters: string,
    utcCronString: string, availableFrom: string, availableTo: string) => {
    try {
        const response = await axios.post(`${BASE_URL}/${connId}/maaRepetitiveTasks`,
            {
                name: name,
                type: type,
                parameters: parameters,
                utcCronString: utcCronString,
                AvailableFrom: availableFrom,
                AvailableTo: availableTo,
            }
            , {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('jwt-token')}`,
                },
            });
        return response.data;
    } catch (error) {
        console.error(`发生异常(id=${connId}): `, error);
        throw error;
    }
};

export default {
    listAllConnections,
    getConnection,
    initializeConnection,
    completeConnection,
    deleteConnection,
    listTasks,
    getConnectionThumbnail,
    getTaskImage,
    listRepetitiveTasks,
    addRepetitiveTask
};
