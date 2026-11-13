
import api from './axios';

export const getCashObligations = async (params) => {
    const response = await api.get('/cash-obligations', {
        params: params
    });
    if (response.status !== 200) {
        console.log(response.data.data)
        return { error: true, data: null, message: response.message };
    }
    return { error: false, data: response.data.data, message: null };
};

export const createCashObligation = async (transaction) => {
    const response = await api.post('/cash-obligations', transaction);
    if (response.status !== 201) {
        console.log("RESPONSE: " + response)
        return { error: true, data: null, message: response.message };
    }
    console.log("RESPONSE: " + response)
    return { error: false, data: response.data, message: response.message };
};

export const updateCashObligation = async (id, transaction) => {
    const response = await api.put(
        `/cash-obligations/${id}`,
        transaction
    );
    if (response.status !== 200) {
        return { error: true, data: null, message: response.message };
    }

    return { error: false, data: response.data, message: response.message };
};

export const deleteCashObligation = async (id) => {
    const response = await api.delete(`/cash-obligations/${id}`);
    if (response.status !== 200) {
        return { error: true, data: null, message: response.message };
    }

    return { error: false, data: response.data, message: response.message };
};
