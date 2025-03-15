import type { ApiResponse } from '$lib';
import type { AxiosResponse } from 'axios';
import apiClient from '../apiClient';
import type { RunText } from '$lib/interface/announcements.types';

export const announcementsApi = {
    /* Get lotto by ID */
    getAnnouncementsById: async (id: string): Promise<RunText> => {
        const response: AxiosResponse<ApiResponse<RunText>> = await apiClient.get(`/public/run-text/${id}`);
        return response.data.data;
    },
}
