import type { ApiResponse } from '$lib';
import type { AxiosResponse } from 'axios';
import apiClient from '../apiClient';
import type { LottoRound } from '$lib/interface/lotto.types';

export const lottoRoundApi = {
    /* Get all active lottos */
    getActiveLottoRounds: async (): Promise<LottoRound[]> => {
        const response: AxiosResponse<ApiResponse<LottoRound[]>> = await apiClient.get('/public/lotto-round');
        return response.data.data;
    },

    /* Get lotto by ID */
    getLottoRoundById: async (id: string): Promise<LottoRound> => {
        const response: AxiosResponse<ApiResponse<LottoRound>> = await apiClient.get(`/public/lotto-round/${id}`);
        return response.data.data;
    },

    /* Get lotto block by ID */
    getLottoBlockById: async (id: string): Promise<LottoRound> => {
        const response: AxiosResponse<ApiResponse<LottoRound>> = await apiClient.get(`/public/lotto-block/${id}`);
        return response.data.data;
    },
};