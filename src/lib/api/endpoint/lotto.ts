import type { ApiResponse } from '$lib';
import type { AxiosResponse } from 'axios';
import apiClient from '../apiClient';

export const lottoApi = {
    /* Get all active lottos */
    getActiveLottos: async (): Promise<unknown[]> => {
        const response: AxiosResponse<ApiResponse<unknown[]>> = await apiClient.get('/public/lotto', {
            params: { is_active: true }
        });
        return response.data.data;
    },

    /* Get lotto by ID */
    getLottoById: async (id: string): Promise<any> => {
        const response: AxiosResponse<Response> = await apiClient.get(`/public/lotto/${id}`);
        return response.data.data;
    },
};

