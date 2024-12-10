import type { ApiResponse } from '$lib';
import type { AxiosResponse } from 'axios';
import apiClient from '../apiClient';
import type { BetSummary } from '$lib/interface/bet.types';

export const betCalculateApi = {
    getBetCalculate: async (betGroup: BetSummary): Promise<BetSummary> => {
        const response: AxiosResponse<ApiResponse<BetSummary>> = await apiClient.post('/public/bet/calculate', betGroup);
        return response.data.data;
    },

    createOrder: async (betGroup: BetSummary): Promise<BetSummary> => {
        const response: AxiosResponse<ApiResponse<BetSummary>> = await apiClient.post('/public/bet/order', betGroup);
        return response.data.data;
    }
};
