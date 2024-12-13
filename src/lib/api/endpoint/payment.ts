import type { ApiResponse } from '$lib';
import type { AxiosResponse } from 'axios';
import apiClient from '../apiClient';

export const paymentApi = {
    createPayment: async (orderId: {
        order_id: string;
        paymentStatus: string;
    }): Promise<unknown> => {
        const response: AxiosResponse<ApiResponse<unknown>> = await apiClient.post('/public/bet/payment', {
            orderId: orderId.order_id,
            paymentStatus: orderId.paymentStatus
        });
        return response.data.data;
    }
};

