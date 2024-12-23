
export type BalanceResponse = {
    reqId: string;
    username: string;
    balance: number;
    currency: string;
    timestamp: number;
    message: string;
    status: string;
}

export type PlaceBetResponse = {
    data: unknown;
    status: string;
    message?: string;
}