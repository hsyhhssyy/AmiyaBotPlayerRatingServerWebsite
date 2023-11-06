import axios from 'axios';

const BASE_URL = '/api/maaTask';

export const getLastThumbnail = async (connectionId: string) => {
    try {
        const response = await axios.get(`${BASE_URL}/GetConnectionLatestScreenShotThumbnail/${connectionId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('jwt-token')}`,
            },
        });
        return response.data.image;
    } catch (error) {
        console.error(`发生异常(id=${connectionId}): `, error);
        throw error;
    }
}

export default {
    getLastThumbnail
};
