import { getUsername, getToken, getAgentName } from './../../../routes/seamless/auth.store';
import type { ApiResponseBalance } from '$lib';
import type { AxiosResponse } from 'axios';
import apiClient from '../apiClient';
import type { BalanceResponse, PlaceBetResponse } from '$lib/interface/balance.types';


export const walletApi = {
    /* Get balance */
    getBalance: async (): Promise<BalanceResponse> => {
        try {
            const response: AxiosResponse<ApiResponseBalance<BalanceResponse>> = await apiClient.post('/users/balance', {
                agent_name: getAgentName(),
                username: getUsername(),
            }, {
                headers: { Authorization: `Bearer ${getToken()}` }
            });

            return response.data.data;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    createBet: async (ticketId: string, roundId: string, amount: number): Promise<PlaceBetResponse> => {
        const response: AxiosResponse<ApiResponseBalance<PlaceBetResponse>> = await apiClient.post('/public/placeBet', {
            agent_name: getAgentName(),
            username: getUsername(),
            betAmount: amount,
            tiketId: ticketId,
            roundId: roundId,
        });

        if (response.data.status !== 'OK') {
            throw new Error(`Bet placement failed: ${response.data.data.message}`);
        }

        return response.data.data;
    }
};
