export interface PaymentResult {
    id: string;
    order_id: string;
    lotto_id: string;
    lotto_name: string;
    amount: number;
    status: PaymentStatus;
    created_at: string;
    updated_at: string;
    error_message: string | null;
    reference_id: string | null;
    transaction_type: 'PAYMENT';
    user_id: string;
}

export type PaymentStatus = "COMPLETED" | "FAILED" | "PENDING";
