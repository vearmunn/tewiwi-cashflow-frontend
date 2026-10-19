
import api from './axios';

export const getTransactions = async () => {
    const response = await api.get('/transactions');
    return response.data;
};

export const createTransaction = async (transaction) => {
    const response = await api.post('/transactions', transaction);
    return response.data;
};

export const updateTransaction = async (id, transaction) => {
    const response = await api.patch(
        `/transactions/${id}`,
        transaction
    );
    return response.data;
};

export const deleteTransaction = async (id) => {
    await api.delete(`/transactions/${id}`);
};
