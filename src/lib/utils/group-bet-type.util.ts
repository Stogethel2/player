import type { LottoBetType } from "../interface/lotto.types";

export interface GroupedBetTypes {
    groupName: string;
    digitGroup: number;
    betTypes: LottoBetType[];
  }
  
  export function groupBetType(betType: LottoBetType[]): GroupedBetTypes[] {
    const groupedBetType = betType.reduce((acc, betType) => {
      if (!acc[betType.bet_digit]) {
        acc[betType.bet_digit] = [];
      }
      acc[betType.bet_digit].push(betType);
      return acc;
    }, {} as Record<number, LottoBetType[]>);
  
    // Map digit to group name
    const digitToGroupName: Record<number, string> = {
      3: 'สามตัว',
      2: 'สองตัว',
      1: 'เลขวิ่ง'
    };
  
    // Transform to array with group names
    const result = Object.entries(groupedBetType).map(([digit, betTypes]) => ({
      groupName: digitToGroupName[Number(digit)] || `${digit} ตัว`,
      digitGroup: Number(digit),
      betTypes: betTypes
    }));
  
    // Sort by digit in descending order (3, 2, 1)
    return result.sort((a, b) => {
      const digitA = a.digitGroup || 0;
      const digitB = b.digitGroup || 0;
      return digitB - digitA;
    });
  }

export function unGroupBetType(betType: Record<number, LottoBetType[]>) {
  return Object.values(betType).flat();
}