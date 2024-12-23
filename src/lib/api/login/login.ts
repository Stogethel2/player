import apiClient from '../apiClient';
import type { AxiosResponse } from 'axios';

interface LoginData {
    status: boolean;
    data: string;
}
interface Agent {
    agent_id: string;
    name: string;
}
interface User {
    user_id: string;
    username: string;
    email: string | null;
    last_active_date: string | null;
    created_at: string;
    updated_at: string;
    agent: Agent;
}

export const loginApi = {
    /* Get all active lottos */
    seamlesslogin: async (): Promise<LoginData> => {
        const response: AxiosResponse<LoginData> = await apiClient.post('/users/seamlesslogin', {
            username: "test01",
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
};

