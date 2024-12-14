import type { ApiResponse } from '$lib';
import type { AxiosResponse } from 'axios';
import apiClient from '../apiClient';
import type { PaymentResult } from '$lib/interface/payment.types';

export const paymentApi = {
    createPayment: async (
        order_id: string,
        payment_status: string
    ): Promise<PaymentResult> => {
        const response: AxiosResponse<ApiResponse<PaymentResult>> = await apiClient.post('/public/bet/payment', {
            order_id: order_id,
            payment_status: payment_status
        });
        return response.data.data;
    },

    createPaymentFail: async (
        order_id: string
    ): Promise<PaymentResult> => {
        const response: AxiosResponse<ApiResponse<PaymentResult>> = await apiClient.post('/public/bet/payment', {
            order_id: order_id
        });
        return response.data.data;
    }
};

