import { writable } from "svelte/store";

export interface LotteryBet {
    id: string;
    number: string;
    amount: number;
    payout?: number;
    displayType: string;
}

export interface BetTypeGroup {
    [typeId: string]: LotteryBet[];
}

export interface BetGroupSummary {
    typeId: string;
    displayType: string;
    number: string;
    displayName: string;
    entries: LotteryBet[];
}

export interface BetSummary {
    groups: BetGroupSummary[];
    totals: {
        bets: number;
        amount: number;
    };
}

function createBetStore() {
    const { subscribe, set, update } = writable<BetTypeGroup>({});

    return {
        subscribe,
        addBet: (typeId: string, number: string, displayType: string) =>
            update((store) => {
                if (!store[typeId]) {
                    store[typeId] = [];
                }
                const betId = `${typeId}|${number}`;
                if (!store[typeId].some((bet) => bet.id === betId)) {
                    store[typeId].push({ 
                        id: betId, 
                        number, 
                        amount: 100, 
                        displayType 
                    });
                }
                return store;
            }),

        removeBet: (typeId: string, number: string) =>
            update((store) => {
                const betId = `${typeId}|${number}`;
                if (store[typeId]) {
                    store[typeId] = store[typeId].filter((bet) => bet.id !== betId);
                    if (store[typeId].length === 0) {
                        delete store[typeId];
                    }
                }
                return store;
            }),

        updateAmount: (typeId: string, number: string, amount: number) =>
            update((store) => {
                const betId = `${typeId}|${number}`;
                if (store[typeId]) {
                    store[typeId] = store[typeId].map((bet) =>
                        bet.id === betId ? { ...bet, amount } : bet
                    );
                }
                return store;
            }),

        clearAll: () => set({}),

        exists: (number: string, typeId: string): boolean => {
            let exists = false;
            const betId = `${typeId}|${number}`;
            update((store) => {
                exists = store[typeId]?.some((bet) => bet.id === betId) ?? false;
                return store;
            });
            return exists;
        },

        getAllBets: () => {
            let allBets: { typeId: string; displayType: string; entries: LotteryBet[] }[] = [];
            update((store) => {
                allBets = Object.entries(store).map(([typeId, bets]) => ({
                    typeId,
                    displayType: bets[0]?.displayType || "",
                    entries: [...bets],
                }));
                return store;
            });
            return allBets;
        },
    };
}

export const LotteryBetStore = createBetStore();