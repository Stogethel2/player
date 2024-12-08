import type { BetSummary, BetGroupSummary, LotteryBet } from "$lib/interface/bet.types";

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

function calculateBetList(bets: LotteryBet[], onEachBet: (bet: LotteryBet) => void): LotteryBet[] {
    return bets.map((bet) => {
        onEachBet(bet);
        return { ...bet };
    });
}

function calculateGroupAmount(betList: LotteryBet[]): number {
    return betList.reduce((sum, bet) => sum + bet.amount, 0);
} 