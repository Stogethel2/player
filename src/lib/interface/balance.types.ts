
export type BalanceResponse = {
    reqId: string;
    username: string;
    balance: number;
    currency: string;
    timestamp: number;
    message: string;
}

export type PlaceBetResponse = {
    data: unknown;
    status: string;
}