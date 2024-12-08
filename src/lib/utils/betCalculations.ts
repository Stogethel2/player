import type { BetSummary, BetGroupSummary, LotteryBet, BetTypeGroup } from "$lib/interface/bet.types";

/**
 * Calculate bet summary from bet store
 * 
 * @param $store - Bet store
 * @returns New BetSummary Object
 */
export function calculateBetSummary($store: Record<string, LotteryBet[]>): BetSummary {
    const { totalBet, totalAmount, betGroups } = calculateBetTotals($store);

    return {
        betGroups,
        totals: { totalBet, totalAmount }
    };
}

/**
 * Calculate total bets and amounts from bet store
 * 
 * @param $store - Bet store
 * @returns Calculated bet totals
 */
function calculateBetTotals($store: Record<string, LotteryBet[]>) {
    let totalBet = 0;
    let totalAmount = 0;

    const betGroups: BetGroupSummary[] = Object.entries($store).map(([betTypeId, bets]) => {
        const betList = calculateBetList(bets, (bet) => {
            totalBet += 1;
            totalAmount += bet.amount;
        });

        return {
            betTypeId,
            betList,
            lottoBetType: bets[0]?.lottoBetType,
            totalGroupAmount: calculateGroupAmount(betList),
            totalGroupBets: betList.length,
        };
    });

    return { totalBet, totalAmount, betGroups };
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
                storeState[group.betTypeId]?.some(storeBet =>
                    storeBet.tempId === bet.tempId
                )
            )
        }))
        .filter(group => group.betList.length > 0);
}