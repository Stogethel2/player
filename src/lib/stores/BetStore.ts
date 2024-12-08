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

        addBet(betTypeId: string, number: string, lottoBetType: LottoBetType, amount: number = 10) {
            update((store) => {
                const newStore = { ...store };
                if (!newStore[betTypeId]) {
                    newStore[betTypeId] = [];
                }

                newStore[betTypeId] = [...newStore[betTypeId], {
                    tempId: betUtils.generateTempId(),
                    number,
                    amount,
                    payout: lottoBetType.current_payout_rate,
                    lottoBetType,
                }];

                return newStore;
            });
        },

        removeBet(betTypeId: string, tempId: string) {
            update((store) => {
                const newStore = { ...store };
                if (newStore[betTypeId]) {
                    newStore[betTypeId] = newStore[betTypeId].filter(bet => bet.tempId !== tempId);
                    if (newStore[betTypeId].length === 0) {
                        delete newStore[betTypeId];
                    }
                }
                return newStore;
            });
        },

        syncBetData(betTypeGroup: BetTypeGroup) {
            update((store) => ({ ...store, ...betTypeGroup }));
        },

        updateAmount(betTypeId: string, tempId: string, amount: number) {
            update((store) => {
                const newStore = { ...store };
                if (newStore[betTypeId]) {
                    newStore[betTypeId] = newStore[betTypeId].map(bet =>
                        bet.tempId === tempId ? { ...bet, amount } : bet
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