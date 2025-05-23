import type { BetSummary, BetGroupSummary, LotteryBet, BetTypeGroup } from "$lib/interface/bet.types";

/**
 * Calculate bet summary from bet store
 * 
 * @param $store - Bet store
 * @returns New BetSummary Object
 */
export function calculateBetSummary($store: Record<string, LotteryBet[]>): BetSummary {
    const { lotto_id, lotto_name, total_bet, total_amount, betGroups } = calculateBetTotals($store);
    return {
        lotto_id,
        lotto_name,
        betGroups,
        totals: { total_bet, total_amount }
    };
}

/**
 * Calculate total bets and amounts from bet store
 * 
 * @param $store - Bet store
 * @returns Calculated bet totals
 */
function calculateBetTotals($store: Record<string, LotteryBet[]>): {
    lotto_id: string;
    lotto_name: string;
    total_bet: number;
    total_amount: number;
    betGroups: BetGroupSummary[];
} {
    let lotto_id: string = "";
    let lotto_name: string = "";
    let total_bet: number = 0;
    let total_amount: number = 0;

    const betGroups: BetGroupSummary[] = Object.entries($store).map(([bet_type_id, bets]) => {
        const betList = calculateBetList(bets, (bet: LotteryBet): void => {
            total_bet += 1;
            total_amount += bet.amount;
        });

        lotto_id = $store[bet_type_id][0].lotto_id || "";
        lotto_name = $store[bet_type_id][0].lotto_name || "";

        return {
            lotto_id,
            lotto_name,
            bet_type_id,
            betList,
            total_ground_amount: calculateGroupAmount(betList),
            total_ground_bets: betList.length,
        };
    });

    return { lotto_id, lotto_name, total_bet, total_amount, betGroups };
}

/**
 * Calculate bet list with onEachBet callback
 * 
 * @param bets - Lottery bets
 * @param onEachBet - Callback function
 * @returns Bet list with updated values
 */
function calculateBetList(bets: LotteryBet[], onEachBet: (bet: LotteryBet) => void): LotteryBet[] {
    return bets.map((bet) => {
        onEachBet(bet);
        return { ...bet };
    });
}

/**
 * Calculate group amount from bet list
 * 
 * @param betList - Lottery bets
 * @returns Group amount
 */
function calculateGroupAmount(betList: LotteryBet[]): number {
    return betList.reduce((sum, bet) => sum + bet.amount, 0);
}

/**
 * Sync bet summary with store state
 * 
 * @param betSummary - Bet summary
 * @param storeState - Bet store state
 * @returns Updated bet groups
 */
export function syncBetSummaryWithStore(
    betSummary: BetSummary | undefined,
    storeState: BetTypeGroup
): BetGroupSummary[] {
    if (!betSummary) return [];
    return betSummary.betGroups
        .map(group => ({
            ...group,
            betList: group.betList.filter(bet =>
                storeState[group.bet_type_id]?.some(storeBet =>
                    storeBet.temp_id === bet.temp_id
                )
            )
        }))
        .filter(group => group.betList.length > 0);
}