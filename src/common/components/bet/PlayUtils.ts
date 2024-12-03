import type { Writable } from "svelte/store";
import type { LottoBetType } from "./Lotto.types";

export const NUMPAD_LAYOUT = [
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    "Rand",
    0,
    "Del",
] as const;

export const colorClasses: Record<string, string> = {
    default: "bg-red-600 text-white",
    "3-top": "bg-red-600 text-white",
    "3-bottom": "bg-red-600 text-white",
    "3-tod": "bg-red-600 text-white",
    "3-reverse": "bg-red-600 text-white",
    "2-top": "bg-yellow-600 text-white",
    "2-bottom": "bg-yellow-600 text-white",
};

export interface BetTypeChangeEvent {
    availableBetTypes: string[];
    digitCount: number;
    selectedBetType: LottoBetType;
    changeType: "activate" | "deactivate";
}

export function processBetTypeSelection(
    event: CustomEvent<BetTypeChangeEvent>,
    betTypeStore: Writable<LottoBetType>
): { selectedType: string; digitLength: number } {
    const { availableBetTypes, digitCount, selectedBetType, changeType } = event.detail;
    betTypeStore.set(selectedBetType);

    if (changeType === "deactivate" && availableBetTypes.length > 0) {
        const newSelectedType = availableBetTypes[0];
        return {
            selectedType: newSelectedType,
            digitLength: newSelectedType.startsWith("3") ? 3 : 2,
        };
    }

    if (availableBetTypes.length > 0) {
        return {
            selectedType: selectedBetType?.id || availableBetTypes[availableBetTypes.length - 1],
            digitLength: digitCount,
        };
    }

    return {
        selectedType: "",
        digitLength: 3, // Default digit length when no types selected
    };
}

export function getTypeClass(tag: string): string {
    if (tag.startsWith("2-")) {
        return "bg-yellow-600 text-white";
    }
    return "bg-red-600 text-white";
}
export const lotteryTypes = [
    { id: "3-top", label: "3 ตัวบน" },
    { id: "3-bottom", label: "3 ตัวล่าง" },
    { id: "3-tod", label: "3 ตัวโต๊ด" },
    { id: "3-reverse", label: "3 ตัวกลับ" },
    { id: "2-top", label: "2 ตัวบน" },
    { id: "2-bottom", label: "2 ตัวล่าง" },
];

export function togglePlayMode(
    currentMode: boolean,
    mode: "custom" | "selector"
): boolean {
    return mode === "custom";
}
