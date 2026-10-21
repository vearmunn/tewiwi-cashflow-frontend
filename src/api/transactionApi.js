
import api from './axios';

export const getTransactions = async () => {
    const response = await api.get('/transactions');
    if (response.status !== 200) {
        console.log(response.data.data)
        return { error: true, data: null, message: response.message };
    }
    return { error: false, data: response.data.data, message: null };
};

export const createTransaction = async (transaction) => {
    const response = await api.post('/transactions', transaction);
    if (response.status !== 201) {
        console.log("RESPONSE: " + response)
        return { error: true, data: null, message: response.message };
    }
    console.log("RESPONSE: " + response)
    return { error: false, data: response.data, message: response.message };
};

export const updateTransaction = async (id, transaction) => {
    const response = await api.put(
        `/transactions/${id}`,
        transaction
    );
    if (response.status !== 200) {
        return { error: true, data: null, message: response.message };
    }

    return { error: false, data: response.data, message: response.message };
};

export const deleteTransaction = async (id) => {
    const response = await api.delete(`/transactions/${id}`);
    if (response.status !== 200) {
        return { error: true, data: null, message: response.message };
    }

    return { error: false, data: response.data, message: response.message };
};
