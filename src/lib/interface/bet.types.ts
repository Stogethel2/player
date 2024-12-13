import type { LottoBetType } from "./lotto.types";

export interface LotteryBet {
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
    bet_type_id: string;
    betList: LotteryBet[];
    total_ground_amount: number;
    total_ground_bets: number;
}

export interface BetSummary {
    betGroups: BetGroupSummary[];
    totals: {
        total_bet: number;
        total_amount: number;
    };
}