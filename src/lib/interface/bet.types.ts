import type { LottoBetType } from "./lotto.types";

export interface LotteryBet {
    tempId: string;
    number: string;
    amount: number;
    payout: number;
    lottoBetType: LottoBetType;
}

export interface BetTypeGroup {
    [betTypeId: string]: LotteryBet[];
}

export interface BetGroupSummary {
    betTypeId: string;
    lottoBetType: LottoBetType;
    betList: LotteryBet[];
    totalGroupAmount: number;
    totalGroupBets: number;
}

export interface BetSummary {
    betGroups: BetGroupSummary[];
    totals: {
        totalBet: number;
        totalAmount: number;
    };
}