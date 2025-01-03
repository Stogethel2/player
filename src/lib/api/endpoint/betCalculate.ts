import type { ApiResponse } from '$lib';
import type { AxiosResponse } from 'axios';
import apiClient from '../apiClient';
import type { BetSummary } from '$lib/interface/bet.types';
import type { Order } from '$lib/interface/order.types';
import { getToken } from '../../../routes/seamless/auth.store';

export const betCalculateApi = {
    getBetCalculate: async (betGroup: BetSummary): Promise<BetSummary> => {
        const response: AxiosResponse<ApiResponse<BetSummary>> = await apiClient.post('/bet/calculate', betGroup, {
            headers: { Authorization: `Bearer ${getToken()}` }
        });
        return response.data.data;
    },

    createOrder: async (betGroup: BetSummary): Promise<Order> => {
        const response: AxiosResponse<ApiResponse<Order>> = await apiClient.post('/bet/order', betGroup, {
            headers: { Authorization: `Bearer ${getToken()}` }
        });
        return response.data.data;
    },

    reOrder: async (order_id: string): Promise<Order> => {
        const response: AxiosResponse<ApiResponse<Order>> = await apiClient.post('/bet/reorder', { order_id: order_id }, {
            headers: { Authorization: `Bearer ${getToken()}` }
        });
        return response.data.data;
    }
};
