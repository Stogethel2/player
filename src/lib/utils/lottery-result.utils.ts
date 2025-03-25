import type { LotteryResult } from "$lib/interface/result.types";

export interface LotteryResultsByType {
  three_top: string;
  three_bottom: string;
  two_top: string;
  two_bottom: string;
  tod: string;
  run_top: string;
  run_bottom: string;
}

/**
 * Organizes lottery results by bet type for easy display
 */
export function getResultsByType(results: LotteryResult[]): LotteryResultsByType {
  return {
    three_top: results.find(r => r.lottoBetType.bet_type === "THREE_DIGIT_TOP")?.user_1_result || "",
    three_bottom: results.find(r => r.lottoBetType.bet_type === "THREE_DIGIT_BOTTOM")?.user_1_result || "",
    two_top: results.find(r => r.lottoBetType.bet_type === "TWO_DIGIT_TOP")?.user_1_result || "",
    two_bottom: results.find(r => r.lottoBetType.bet_type === "TWO_DIGIT_BOTTOM")?.user_1_result || "",
    tod: results.find(r => r.lottoBetType.bet_type === "THREE_DIGIT_TOD")?.user_1_result || "",
    run_top: results.find(r => r.lottoBetType.bet_type === "ONE_DIGIT_RUN_TOP")?.user_1_result || "",
    run_bottom: results.find(r => r.lottoBetType.bet_type === "ONE_DIGIT_RUN_BOTTOM")?.user_1_result || ""
  };
}

/**
 * Gets appropriate background color class based on lottery name
 */
export function getBackgroundColorClass(lotteryName: string): string {
  const colorMap: { [key: string]: string } = {
    "หวยลาวชุด": "bg-red-500",
    "หวยไทย": "bg-blue-500",
    "หวยเวียดนาม": "bg-pink-500",
  };
  
  for (const [key, value] of Object.entries(colorMap)) {
    if (lotteryName.includes(key)) {
      return value;
    }
  }
  
  return "bg-gray-500"; // Default color
}

/**
 * Formats date for display
 */
export function formatLotteryDate(dateString: string): string {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString("th-TH", options);
} 