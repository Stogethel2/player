import type { ApiResponse } from '$lib';
import type { AxiosResponse } from 'axios';
import apiClient from '../apiClient';
import type { LottoRound } from '$lib/interface/lotto.types';

export const lottoRoundApi = {
    /* Get all active lottos */
    getActiveLottoRounds: async (): Promise<LottoRound[]> => {
        const response: AxiosResponse<ApiResponse<LottoRound[]>> = await apiClient.get('/public/lotto-round', {
            params: { is_active: true }
        });
        return response.data.data;
    },

    /* Get lotto by ID */
    getLottoRoundById: async (id: string): Promise<LottoRound> => {
        const response: AxiosResponse<ApiResponse<LottoRound>> = await apiClient.get(`/public/lotto-round/${id}`);
        return response.data.data;
    },
};