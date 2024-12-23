import { getUsername, username, getAgentName } from './../../../routes/seamless/auth.store';
import type { ApiResponseBalance } from '$lib';
import type { AxiosResponse } from 'axios';
import apiClientWallet from '../apiClientWallet';
import type { BalanceResponse, PlaceBetResponse } from '$lib/interface/balance.types';


export const walletApi = {
    /* Get balance */
    getBalance: async (username: string): Promise<BalanceResponse> => {
        const response: AxiosResponse<ApiResponseBalance<BalanceResponse>> = await apiClientWallet.post('/getBalance', {
            agent_name: getAgentName(),
            username: username
        });
        if (response.data.status !== 'OK') {
            throw new Error(`Get balance failed: ${response.data.data.status}`);
        }

        return response.data.data;
    },

    createBet: async (ticketId: string, roundId: string, amount: number): Promise<PlaceBetResponse> => {
        const response: AxiosResponse<ApiResponseBalance<PlaceBetResponse>> = await apiClientWallet.post('/placeBet', {
            agent_name: getAgentName(),
            username: getUsername(),    
            betAmount: amount,
            tiketId: ticketId,
            roundId: roundId,
        });

        if (response.data.status !== 'OK') {
            throw new Error(`Bet placement failed: ${response.data.data.status}`);
        }

        return response.data.data;
    }
};
