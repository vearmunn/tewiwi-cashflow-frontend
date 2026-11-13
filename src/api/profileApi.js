import api from './axios';

export const findUserByID = async () => {
    const response = await api.get(`/auth/profile`);
    if (response.status !== 200) {
        console.log(response.message)
        return { error: true, data: null, message: response.message };
    }
    return { error: false, data: response.data, message: response.message };
};