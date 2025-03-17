import type { ApiResponse } from '$lib';
import type { AxiosResponse } from 'axios';
import apiClient from '../apiClient';
import type { Response } from '$lib/interface/order.types';
import { getToken } from '../../../routes/seamless/auth.store';

export const orderApi = {
    getOrderHistory: async (page:number, lottoResult: string): Promise<Response> => {
        try {
            const response: AxiosResponse<ApiResponse<Response>> = await apiClient.get(`order/${page}/${lottoResult}`, {
                headers: { Authorization: `Bearer ${getToken()}` }
            });
            return response.data.data;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },
};

