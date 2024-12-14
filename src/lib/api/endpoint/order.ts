import type { ApiResponse } from '$lib';
import type { AxiosResponse } from 'axios';
import apiClient from '../apiClient';
import type { Response } from '$lib/interface/order.types';

export const orderApi = {
    getOrderHistory: async (): Promise<Response> => {
        const response: AxiosResponse<ApiResponse<Response>> = await apiClient.get('public/order');
        return response.data.data;
    },
};

