import type { ApiResponse } from '$lib';
import type { AxiosResponse } from 'axios';
import apiClient from '../apiClient';

export const lottoRoundApi = {
    /* Get all active lottos */
    getActiveLottoRounds: async (): Promise<unknown[]> => {
        const response: AxiosResponse<ApiResponse<unknown[]>> = await apiClient.get('/public/lotto-round', {
            params: { is_active: true }
        });
        return response.data.data;
    },

    /* Get lotto by ID */
    getLottoRoundById: async (id: string): Promise<any> => {
        const response: AxiosResponse<Response> = await apiClient.get(`/public/lotto-round/${id}`);
        return response.data.data;
    },
};