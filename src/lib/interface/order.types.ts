export type Order = {
    order_id: string;
    orderBets: OrderBet[];
}

export type OrderBet = {
    order_id: string;
    lotto_id: string;
    lotto_round_id: string;
    lotto_bet_type_id: string;
    lotto_round_loss_id: string;
    bet_amount: number;
    bet_number: string;
    payout: number;
}