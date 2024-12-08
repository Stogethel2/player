export enum DrawFrequency {
    HOUR = 'HOUR',
    THREE_HOURS = 'THREE_HOURS',
    SIX_HOURS = 'SIX_HOURS',
    DAY = 'DAY',
    WEEK = 'WEEK',
    BIWEEK = 'BIWEEK',
    MONTH = 'MONTH',
}

export enum BetType {
    THREE_DIGIT_TOP = 'THREE_DIGIT_TOP',
    THREE_DIGIT_BOTTOM = 'THREE_DIGIT_BOTTOM',
    THREE_DIGIT_TOD = 'THREE_DIGIT_TOD',
    THREE_DIGIT_REVERSE = 'THREE_DIGIT_REVERSE',
    TWO_DIGIT_TOP = 'TWO_DIGIT_TOP',
    TWO_DIGIT_BOTTOM = 'TWO_DIGIT_BOTTOM',
}

export interface Lotto {
    id: string;
    lotto_name: string;
    draw_frequency: DrawFrequency;
    lotto_image: string;
    description: string;
    is_automatic_round: boolean;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

export interface LottoBetType {
    id: string;
    lotto_round_id: string;
    bet_type: BetType;
    bet_type_name: string;
    bet_digit: number;
    min_bet: number;
    max_bet: number;
    default_payout: number;
    current_payout_rate: number;
    is_active: boolean;
    is_block: boolean;
    current_round_loss_id?: string;
    created_at: string;
}

export interface LottoRound {
    id: string;
    lotto_id: string;
    round_date: string;
    possible_loss: number;
    is_active: boolean;
    is_loss_round_open: boolean;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    lotto: Lotto;
    lottoBetTypes: LottoBetType[];
    headerColorClass?: string;
}
