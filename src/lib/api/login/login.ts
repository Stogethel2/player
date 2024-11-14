import apiClient from '../apiClient';
import type { AxiosResponse } from 'axios';

interface LoginData {
    status: boolean;
    data: string;
}

interface User {
    user_id: string;
    username: string;
    email: string | null;
    last_active_date: string | null;
    created_at: string;
    updated_at: string;
    agent: string | null;
}

export const loginApi = {
    /* Get all active lottos */
    seamlesslogin: async (): Promise<LoginData> => {
        const response: AxiosResponse<LoginData> = await apiClient.post('/users/seamlesslogin', {
            username: "test001",
            isMobileLogin: true
        });
        return response.data;
    },

    getUsers: async (token: string): Promise<User> => {
        const response: AxiosResponse<User> = await apiClient.get('/users/me', {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },
    // /* Get lotto by ID */
    // getLottoById: async (id: number): Promise<Response> => {
    //     const response: AxiosResponse<Response> = await apiClient.get(`/public/lotto/${id}`);
    //     return response.data;
    // },
};

