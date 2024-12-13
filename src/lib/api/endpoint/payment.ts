import type { ApiResponse } from '$lib';
import type { AxiosResponse } from 'axios';
import apiClient from '../apiClient';

export const paymentApi = {
    createPayment: async (
        order_id: string,
        payment_status: string
    ): Promise<unknown> => {
        const response: AxiosResponse<ApiResponse<unknown>> = await apiClient.post('/public/bet/payment', {
            order_id: order_id,
            payment_status: payment_status
        });
        return response.data.data;
    }
};

