import apiClient from '../apiClient';
import type { AxiosResponse } from 'axios';

interface ApiResponse<T> {
    message: string;
    code: number;
    data: T;
}

export const lottoApi = {
    /* Get all active lottos */
    getActiveLottos: async (): Promise<unknown[]> => {
        const response: AxiosResponse<ApiResponse<unknown[]>> = await apiClient.get('/public/lotto', {
            params: { is_active: true }
        });
        return response.data.data;
    },

    /* Get lotto by ID */
    getLottoById: async (id: number): Promise<Response> => {
        const response: AxiosResponse<Response> = await apiClient.get(`/public/lotto/${id}`);
        return response.data;
    },
};

