export type Order = {
    order_id: string;
    orderBets: OrderBet[];

}

export type Response = {
    orders: OrderResponse[];
}

export type OrderResponse = {
    id: string;
    status: string;
    total_amount: number;
    created_at: string;
    orderBets: OrderBet[];
}

export type OrderBet = {
    order_id: string;
    lotto_id: string;
    lotto_round_id: string;
    lotto_bet_type_id: string;
    lotto_round_loss_id: string;
    bet_type_name: string;
    bet_amount: number;
    bet_number: string;
    payout: number;
}