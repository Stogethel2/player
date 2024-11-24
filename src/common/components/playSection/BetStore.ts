import { writable, get } from "svelte/store";

export interface BetType {
  id: string;
  bet_type_name: string;
  display_type: string;
  digit_length: number;
}

export interface LotteryBet {
  tempId: string;
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
  entries: LotteryBet[];
  totalAmount: number;
  totalBets: number;
}

export interface BetSummary {
  groups: BetGroupSummary[];
  totals: {
    bets: number;
    amount: number;
  };
}

let tempIdCounter = 0;

function generateTempId(): string {
  return `temp_${Date.now()}_${tempIdCounter++}`;
}

function createBetStore() {
  const store = writable<BetTypeGroup>({});
  const { subscribe, set, update } = store;

  return {
    subscribe,
    
    addBet: (typeId: string, number: string, displayType: string, amount: number = 0) =>
      update((store) => {
        const newStore = { ...store };
        if (!newStore[typeId]) {
          newStore[typeId] = [];
        }
        
        newStore[typeId] = [...newStore[typeId], {
          tempId: generateTempId(),
          number,
          amount,
          displayType,
        }];
        
        return newStore;
      }),

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

    clearAll: () => set({}),

    getSummary: (): BetSummary => {
      const currentStore = get(store);
      
      const groups = Object.entries(currentStore || {}).map(([typeId, bets]) => {
        const totalAmount = bets.reduce((sum, bet) => sum + (bet.amount || 0), 0);
        
        return {
          typeId,
          displayType: bets[0]?.displayType || "",
          entries: [...bets],
          totalAmount,
          totalBets: bets.length
        };
      });

      const totals = groups.reduce(
        (acc, group) => ({
          bets: acc.bets + group.totalBets,
          amount: acc.amount + group.totalAmount
        }),
        { bets: 0, amount: 0 }
      );

      return { groups, totals };
    },

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

    getTotalBets: (): number => {
      const currentStore = get(store);
      return Object.values(currentStore || {}).reduce(
        (sum, bets) => sum + bets.length,
        0
      );
    }
  };
}

export const betStore = createBetStore();