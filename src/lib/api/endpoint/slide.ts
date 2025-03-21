import type { ApiResponse } from '$lib';
import type { AxiosResponse } from 'axios';
import apiClient from '../apiClient';
import type { Response } from '$lib/interface/banner.types';
import { getToken } from '../../../routes/seamless/auth.store';

export const BannerApi = {
    getBanner: async (): Promise<Response[]> => {
        try {
            const response: AxiosResponse<ApiResponse<Response[]>> = await apiClient.get('/public/banners', {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                },
            });
            return response.data.data;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    getBannerAgent: async (id: string): Promise<Response[]> => {
        try {
            const response: AxiosResponse<ApiResponse<Response[]>> = await apiClient.get(`/public/banners/agent/${id}`, {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                },
            });
            return response.data.data;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }
};
