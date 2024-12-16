import type { ApiResponse } from '$lib';
import type { AxiosResponse } from 'axios';
import apiClient from '../apiClient';
import type { Lotto } from '$lib/interface/Lotto.types';

export const lottoApi = {
    /* Get all active lottos */
    getActiveLottos: async (): Promise<Lotto[]> => {
        const response: AxiosResponse<ApiResponse<Lotto[]>> = await apiClient.get('/public/lotto', {
            params: { is_active: true }
        });
        return response.data.data;
    },

    /* Get lotto by ID */
    getLottoById: async (id: string): Promise<Lotto> => {
        const response: AxiosResponse<ApiResponse<Lotto>> = await apiClient.get(`/public/lotto/${id}`);
        return response.data.data;
    },
};

