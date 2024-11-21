export interface Lotto {
    id: string;
    lotto_name: string;
    draw_frequency: string;
    lotto_image: string;
    description: string;
    is_automatic_round: boolean;
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string | null;
  }
  
  export interface BetType {
    id: string;
    lotto_round_id: string;
    bet_type_name: string;
    bet_digit: number;
    max_loss: number;
    payout: number;
    min_bet: number;
    max_bet: number;
    is_active: boolean;
    is_block: boolean;
    bet_type: 'THREE_DIGIT_TOP' | 'THREE_DIGIT_BOTTOM' | 'THREE_DIGIT_TOD' | 'THREE_DIGIT_REVERSE' | 'TWO_DIGIT_TOP' | 'TWO_DIGIT_BOTTOM';
    created_at?: string;
    updated_at?: string;
    deleted_at?: string | null;
  }
  
  export interface LottoRound {
    id: string;
    lotto_id: string;
    round_date: string;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string | null;
    lotto: Lotto;
    lottoBetTypes: BetType[];
  }