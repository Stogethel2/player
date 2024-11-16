import type { ApiResponse } from '$lib';
import type { AxiosResponse } from 'axios';
import apiClient from '../apiClient';

export const betCalculateApi = {
    getBetCalculate: async (betGroup: any): Promise<any> => {
        const response: AxiosResponse<ApiResponse<any>> = await apiClient.post('/public/bet-calculate', betGroup);
        return response.data.data;
    }
};