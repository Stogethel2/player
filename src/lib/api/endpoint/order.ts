import type { ApiResponse } from '$lib';
import type { AxiosResponse } from 'axios';
import apiClient from '../apiClient';
import type { Response } from '$lib/interface/order.types';
import { getToken } from '../../../routes/seamless/auth.store';

export const orderApi = {
    getOrderHistory: async (): Promise<Response> => {
        const response: AxiosResponse<ApiResponse<Response>> = await apiClient.get('order', {
            headers: { Authorization: `Bearer ${getToken()}` }
        });
        return response.data.data;
    },
};

