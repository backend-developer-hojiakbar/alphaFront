// src/services/apiService.ts

const API_BASE_URL = 'http://printapi.cdcgroup.uz/api';

const getAuthToken = () => {
    return localStorage.getItem('accessToken');
};

const apiRequest = async (endpoint: string, method: string = 'GET', body: any = null) => {
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };
    const token = getAuthToken();
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config: RequestInit = {
        method,
        headers,
    };

    if (body) {
        config.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(`${API_BASE_URL}/${endpoint}`, config);

        if (response.status === 401) {
            localStorage.removeItem('accessToken');
            window.location.reload(); 
            throw new Error('Token eskirgan. Tizimga qayta kiring.');
        }

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || errorData.error || `Request failed with status ${response.status}`);
        }
        if (response.status === 204) {
            return null;
        }
        return response.json();
    } catch (error) {
        console.error(`API Error on ${method} ${endpoint}:`, error);
        throw error;
    }
};

export const register = (data: any) => apiRequest('auth/register/', 'POST', data);
export const login = (data: any) => apiRequest('auth/login/', 'POST', data);
export const getProfile = () => apiRequest('auth/profile/');
export const updateProfile = (data: any) => apiRequest('auth/profile/', 'PUT', data);

export const getMySubscriptions = () => apiRequest('my-subscriptions/'); // <<< --- YANGI FUNKSIYA --- >>>

export const getProducts = () => apiRequest('products/', 'GET');
export const getMaterials = () => apiRequest('materials/', 'GET');
export const getTemplates = () => apiRequest('templates/', 'GET');
export const getTariffPlans = () => apiRequest('tariff-plans/', 'GET');

export const getPriceList = () => apiRequest('price-list/');
export const updatePriceList = (data: any) => apiRequest('price-list/', 'PUT', data);

export const getOrders = () => apiRequest('orders/');
export const createOrder = (data: any) => apiRequest('orders/', 'POST', data);

const adminApiRequest = (endpoint: string, method: string = 'GET', body: any = null) => {
    return apiRequest(`admin/${endpoint}`, method, body);
};

export const adminGetUsers = () => adminApiRequest('users/');
export const adminUpdateUser = (phone: string, data: any) => adminApiRequest(`users/${phone}/`, 'PUT', data);

export const adminGetSubscriptions = () => adminApiRequest('subscriptions/');
export const adminCreateSubscription = (data: any) => adminApiRequest('subscriptions/', 'POST', data);
export const adminUpdateSubscription = (id: number, data: any) => adminApiRequest(`subscriptions/${id}/`, 'PUT', data);
export const adminDeleteSubscription = (id: number) => adminApiRequest(`subscriptions/${id}/`, 'DELETE');

export const adminGetProducts = () => adminApiRequest('products/');
export const adminUpdateProduct = (id: string, data: any) => adminApiRequest(`products/${id}/`, 'PUT', data);
export const adminCreateProduct = (data: any) => adminApiRequest('products/', 'POST', data);
export const adminDeleteProduct = (id: string) => adminApiRequest(`products/${id}/`, 'DELETE');

export const adminGetMaterials = () => adminApiRequest('materials/');
export const adminUpdateMaterial = (id: string, data: any) => adminApiRequest(`materials/${id}/`, 'PUT', data);
export const adminCreateMaterial = (data: any) => adminApiRequest('materials/', 'POST', data);
export const adminDeleteMaterial = (id: string) => adminApiRequest(`materials/${id}/`, 'DELETE');

export const adminGetTemplates = () => adminApiRequest('templates/');
export const adminUpdateTemplate = (id: string, data: any) => adminApiRequest(`templates/${id}/`, 'PUT', data);
export const adminCreateTemplate = (data: any) => adminApiRequest('templates/', 'POST', data);
export const adminDeleteTemplate = (id: string) => adminApiRequest(`templates/${id}/`, 'DELETE');

export const adminGetPromoCodes = () => adminApiRequest('promocodes/');
export const adminUpdatePromoCode = (id: string, data: any) => adminApiRequest(`promocodes/${id}/`, 'PUT', data);
export const adminCreatePromoCode = (data: any) => adminApiRequest('promocodes/', 'POST', data);
export const adminDeletePromoCode = (id: string) => adminApiRequest(`promocodes/${id}/`, 'DELETE');

export const adminGetTariffPlans = () => adminApiRequest('tariffplans/');
export const adminUpdateTariffPlan = (id: string, data: any) => adminApiRequest(`tariffplans/${id}/`, 'PUT', data);
export const adminCreateTariffPlan = (data: any) => adminApiRequest('tariffplans/', 'POST', data);
export const adminDeleteTariffPlan = (id: string) => adminApiRequest(`tariffplans/${id}/`, 'DELETE');

export const adminGetAuditLog = () => adminApiRequest('auditlog/');