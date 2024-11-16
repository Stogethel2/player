import { writable } from "svelte/store";

export interface BetEntry {
  betId: string;
  betNo: string;
  amount: number;
  payout?: number;
}

export interface BetEntryStore {
  [key: string]: BetEntry[];
}

export interface BetGroup {
  type: string;
  betName: string;
  entry: BetEntry[];
}

export interface TotalList {
  betGroup: BetGroup[];
  summary: {
    totalBets: number;
    totalAmount: number;
  };
}

function createLotteryBetStore() {
  const { subscribe, set, update } = writable<BetEntryStore>({});

  return {
    subscribe,
    /* Add a new entry to the store */
    addBetEntry: (type: string, betNo: string) =>
      update((store) => {
        if (!store[type]) {
          store[type] = [];
        }
        const betId = `${type}|${betNo}`;
        if (!store[type].some((entry) => entry.betId === betId)) {
          store[type].push({ betNo, amount: 100, betId });
        }

        return store;
      }),
      
    /* Remove an entry from the store */
    removeBetEntry: (type: string, betNo: string) =>
      update((store) => {
        const betId = `${type}|${betNo}`;
        
        if (store[type]) {
          store[type] = store[type].filter((entry) => entry.betId !== betId);
          if (store[type].length === 0) {
            delete store[type];
          }
        }
        return store;
      }),

    /* Update the amount for a specific entry */
    updateBetAmount: (type: string, betNo: string, amount: number) =>
      update((store) => {
        const betId = `${type}|${betNo}`;

        if (store[type]) {
          store[type] = store[type].map((entry) =>
            entry.betId === betId ? { ...entry, amount } : entry
          );
        }
        return store;
      }),

    /* Clear all entries from the store */
    clear: () => set({}),

    /* Check if an entry exists in the store */
    checkBetEntryExists: (betNo: string, type: string): boolean => {
      let exists = false;
      const betId = `${type}|${betNo}`;
      update((store) => {
        exists = store[type]?.some((entry) => entry.betId === betId) ?? false;
        return store;
      });
      return exists;
    },

    getAllBetEntries: () => {
      let allEntries: { type: string; entries: BetEntry[] }[] = [];
      update((store) => {
        allEntries = Object.entries(store).map(([type, entries]) => ({
          type,
          entries: [...entries],
        }));
        return store;
      });
      return allEntries;
    },
  };
}

export const LotteryBetStore = createLotteryBetStore();
