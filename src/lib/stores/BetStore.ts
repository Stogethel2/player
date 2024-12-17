import { writable, get } from "svelte/store";
import type { BetTypeGroup, LotteryBet, BetSummary } from "../interface/bet.types";
import type { LottoBetType } from "../interface/lotto.types";
import { betUtils } from "../utils/betUtils";
import { calculateBetSummary } from "$lib/utils/betCalculations";

function createBetStore() {
    const store = writable<BetTypeGroup>({});
    const { subscribe, set, update } = store;

    return {
        subscribe,

        addBet(bet_type_id: string, number: string, lottoBetType: LottoBetType, amount: number = 10) {
            update((store) => {
                const newStore = { ...store };
                if (!newStore[bet_type_id]) {
                    newStore[bet_type_id] = [];
                }

                newStore[bet_type_id] = [...newStore[bet_type_id], {
                    temp_id: betUtils.generateTempId(),
                    number,
                    amount,
                    payout: lottoBetType.current_payout_rate,
                }];

                return newStore;
            });
        },

        removeBet(bet_type_id: string, temp_id: string) {
            update((store) => {
                const newStore = { ...store };
                if (newStore[bet_type_id]) {
                    newStore[bet_type_id] = newStore[bet_type_id].filter(bet => bet.temp_id !== temp_id);
                    if (newStore[bet_type_id].length === 0) {
                        delete newStore[bet_type_id];
                    }
                }
                return newStore;
            });
        },

        syncBetData(betTypeGroup: BetTypeGroup) {
            update((store) => ({ ...store, ...betTypeGroup }));
        },

        updateAmount(bet_type_id: string, temp_id: string, amount: number) {
            update((store) => {
                const newStore = { ...store };
                if (newStore[bet_type_id]) {
                    newStore[bet_type_id] = newStore[bet_type_id].map(bet =>
                        bet.temp_id === temp_id ? { ...bet, amount } : bet
                    );
                }
                return newStore;
            });
        },

        clearAll() {
            set({});
        },

        getSummary(): BetSummary {
            return calculateBetSummary(get(store));
        },

        getTotalBets(): number {
            const currentStore = get(store);
            return Object.values(currentStore || {}).reduce(
                (sum, bets) => sum + bets.length,
                0
            );
        }
    };
}

export const betStore = createBetStore();