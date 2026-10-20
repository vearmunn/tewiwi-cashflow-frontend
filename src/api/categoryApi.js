import api from './axios'

export const getCategories = async () => {
    const response = await api.get("/categories");
    if (response.status !== 200) {
        console.log(response.data.data)
        return { error: true, data: null, message: response.message };
    }
    return { error: false, data: response.data.data, message: null };
};

export const createCategory = async (category) => {
    const response = await api.post("/categories", category);
    if (response.status !== 201) {
        return { error: true, data: null, message: response.message };
    }

    return { error: false, data: response.data, message: response.message };
};

export const updateCategory = async (id, name, type) => {
    const response = await api.put("/categories/" + id, { name, type });
    if (response.status !== 200) {
        return { error: true, data: null, message: response.message };
    }

    return { error: false, data: response.data, message: response.message };
};

export const deleteCategory = async (id) => {
    const response = await api.delete("/categories/" + id);
    if (response.status !== 200) {
        return { error: true, data: null, message: response.message };
    }

    return { error: false, data: response.data, message: response.message };
};