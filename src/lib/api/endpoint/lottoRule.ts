import type { ApiResponse } from '$lib';
import type { AxiosResponse } from 'axios';
import apiClient from '../apiClient';
import type { LottoRule } from '$lib/interface/lottoRule.types';

export const lottoRuleApi = {
    /* Get lottoRule by ID */
    getLottoRuleById: async (id: string): Promise<LottoRule> => {
        const response: AxiosResponse<ApiResponse<LottoRule>> = await apiClient.get(`/public/lotto-rule/${id}`);
        return response.data.data;
    },
}
