import { getUsername, username } from './../../../routes/seamless/auth.store';
import type { ApiResponseBalance } from '$lib';
import type { AxiosResponse } from 'axios';
import apiClientWallet from '../apiClientWallet';
import type { BalanceResponse, PlaceBetResponse } from '$lib/interface/balance.types';

const TOKEN = 'd7ba9db3-af05-4dd7-b051-b15c475c3986';


export const walletApi = {
    /* Get balance */
    getBalance: async (username: string): Promise<BalanceResponse> => {
        const response: AxiosResponse<ApiResponseBalance<BalanceResponse>> = await apiClientWallet.post('/getBalance', {
            token: TOKEN,
            username: username
        });
        return response.data.data;
    },

    createBet: async (ticketId: string, roundId: string, amount: number): Promise<PlaceBetResponse> => {
        const response: AxiosResponse<ApiResponseBalance<PlaceBetResponse>> = await apiClientWallet.post('/placeBet', {
            token: TOKEN,
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
