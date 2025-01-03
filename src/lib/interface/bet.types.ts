import type { LottoBetType } from "./lotto.types";

export interface LotteryBet {
    lotto_id: string;
    lotto_name: string;
    temp_id: string;
    number: string;
    amount: number;
    payout: number;
    lottoBetType?: LottoBetType;
}

export interface BetTypeGroup {
    [bet_type_id: string]: LotteryBet[];
}

export interface BetGroupSummary {
    lotto_id: string;
    lotto_name: string;
    bet_type_id: string;
    betList: LotteryBet[];
    total_ground_amount: number;
    total_ground_bets: number;
    lottoBetType?: LottoBetType;
}

export interface BetSummary {
    lotto_id: string;
    lotto_name: string;
    betGroups: BetGroupSummary[]
    totals: {
        total_bet: number;
        total_amount: number;
    };
}
