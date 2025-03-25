export interface LottoBetType {
    bet_type: string;
    bet_type_name: string;
    bet_digit: number;
}

export interface LotteryResult {
    id: string;
    lotto_round_id: string;
    lotto_id: string;
    lotto_name: string;
    lotto_bet_type_id: string;
    submitted_by_user_1: string;
    submitted_by_user_2: string | null;
    user_1_result: string;
    user_2_result: string;
    user_1_result_updated: string;
    user_2_result_updated: string;
    created_at: string;
    deleted_at: string | null;
    is_approved: boolean;
    approved_by: string | null;
    approved_at: string;
    lottoBetType: LottoBetType;
}

export interface LotteryRound {
    id: string;
    lotto_id: string;
    lotto_name: string;
    round_date: string;
    round_status: string;
}

export interface LotteryResultData {
    round: LotteryRound;
    results: LotteryResult[];
}

export interface LotteryResults {
    data: LotteryResultData[];
    pagination: {
        page: number;
        limit: number;
    };
}
