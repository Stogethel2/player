import type { LotteryResults } from "$lib/interface/result.types";
import { getToken } from '../../../routes/seamless/auth.store';
import apiClient from "../apiClient";

export const resultApi = {
    getResults: async (): Promise<LotteryResults> => {
        const response = await apiClient.get("/result", {
            headers: { Authorization: `Bearer ${getToken()}` }
        });
        return response.data;
    },
}
