import { writable, get } from "svelte/store";
import type { LottoBetType } from "./Lotto.types";

/* Interface representing a single bet with unique temporary ID and details */
export interface LotteryBet {
    tempId: string;
    number: string;
    amount: number;
    payout?: number;
    lottoBetType: LottoBetType;
}

/* Groups of bets organized by type ID */
export interface BetTypeGroup {
    [typeId: string]: LotteryBet[];
}

/* Summary information for a group of bets of the same type */
export interface BetGroupSummary {
    typeId: string;
    lottoBetType: LottoBetType;
    betList: LotteryBet[];
    totalAmount: number;
    totalBets: number;
}

/* Complete summary of all bets and totals */
export interface BetSummary {
    betGroups: BetGroupSummary[];
    totals: {
        totalBet: number;
        totalAmount: number;
    };
}

/* Counter for generating unique temporary IDs */
let tempIdCounter = 0;

/* Creates a unique temporary ID using timestamp and counter */
function generateTempId(): string {
    return `temp_${Date.now()}_${tempIdCounter++}`;
}

/* Creates and returns a store for managing lottery bets */
function createBetStore() {
    const store = writable<BetTypeGroup>({});
    const { subscribe, set, update } = store;

    return {
        subscribe,

        /* Adds a new bet to the store under specified type ID */
        addBet: (typeId: string, number: string, lottoBetType: LottoBetType, amount: number = 0) =>
            update((store) => {
                const newStore = { ...store };
                if (!newStore[typeId]) {
                    newStore[typeId] = [];
                }

                newStore[typeId] = [...newStore[typeId], {
                    tempId: generateTempId(),
                    number,
                    amount,
                    lottoBetType,
                }];

                return newStore;
            }),

        /* Removes a bet from the store using type ID and temporary ID */
        removeBet: (typeId: string, tempId: string) =>
            update((store) => {
                const newStore = { ...store };
                if (newStore[typeId]) {
                    newStore[typeId] = newStore[typeId].filter(bet => bet.tempId !== tempId);
                    if (newStore[typeId].length === 0) {
                        delete newStore[typeId];
                    }
                }
                return newStore;
            }),

        /* Updates the amount for a specific bet identified by type ID and temporary ID */
        updateAmount: (typeId: string, tempId: string, amount: number) =>
            update((store) => {
                const newStore = { ...store };
                if (newStore[typeId]) {
                    newStore[typeId] = newStore[typeId].map(bet =>
                        bet.tempId === tempId ? { ...bet, amount } : bet
                    );
                }
                return newStore;
            }),

        /* Clears all bets from the store */
        clearAll: () => set({}),

        /* Generates a summary of all bets, including totals and group information */
        getSummary: (): BetSummary => {
            const currentStore = get(store);

            /* Create summaries for each bet type group */
            const betGroups = Object.entries(currentStore || {}).map(([typeId, bets]) => {
                const totalAmount = bets.reduce((sum: number, bet: LotteryBet) => sum + (bet.amount || 0), 0);

                return {
                    typeId,
                    lottoBetType: bets[0]?.lottoBetType,
                    betList: [...bets],
                    totalAmount,
                    totalBets: bets.length
                };
            });

            /* Calculate overall totals across all groups */
            const totals = betGroups.reduce(
                (acc, group) => ({
                    totalBet: acc.totalBet + group.totalBets,
                    totalAmount: acc.totalAmount + group.totalAmount
                }),
                { totalBet: 0, totalAmount: 0 }
            );

            return { betGroups, totals };
        },

        /* Updates amounts for multiple bets at once */
        updateMultipleAmounts: (updates: { typeId: string, tempId: string, amount: number }[]) =>
            update((store) => {
                const newStore = { ...store };
                updates.forEach(({ typeId, tempId, amount }) => {
                    if (newStore[typeId]) {
                        newStore[typeId] = newStore[typeId].map(bet =>
                            bet.tempId === tempId ? { ...bet, amount } : bet
                        );
                    }
                });
                return newStore;
            }),

        /* Returns the total number of bets across all types */
        getTotalBets: (): number => {
            const currentStore = get(store);
            return Object.values(currentStore || {}).reduce(
                (sum, bets) => sum + bets.length,
                0
            );
        }
    };
}

/* Create and export the bet store instance */
export const betStore = createBetStore();