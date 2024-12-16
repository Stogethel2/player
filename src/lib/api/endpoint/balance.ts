import { username } from './../../../routes/seamless/auth.store';
import type { ApiResponseBalance } from '$lib';
import type { AxiosResponse } from 'axios';
import apiClientWallet from '../apiClientWallet';
import type { balance } from '$lib/interface/balance.types';
import { env } from '../config';

export const balanceRoundApi = {
    /* Get balance */
    getBalanceRounds: async (username: string): Promise<balance> => {
        const response: AxiosResponse<ApiResponseBalance<balance>> = await apiClientWallet.post('/getBalance', {
            token: 'd7ba9db3-af05-4dd7-b051-b15c475c3986',
            username: username
        });
        return response.data.Data;
    }
};