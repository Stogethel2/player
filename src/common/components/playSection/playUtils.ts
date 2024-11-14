import type { Writable } from "svelte/store";

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

export interface LotteryTypeChangeEvent {
  activeTypes: string[];
  inputLength: number;
  selectedType: string;
  action: "activate" | "deactivate";
}

export function handleLotteryTypesChanged(
  event: CustomEvent<LotteryTypeChangeEvent>,
  activeLotteryTypesStore: Writable<string>
): { currentLotteryType: string; currentInputLength: number } {
  const { activeTypes, inputLength, selectedType, action } = event.detail;
  activeLotteryTypesStore.set(selectedType);

  if (action === "deactivate" && activeTypes.length > 0) {
    const newCurrentType = activeTypes[0];
    return {
      currentLotteryType: newCurrentType,
      currentInputLength: newCurrentType.startsWith("3") ? 3 : 2,
    };
  }

  if (activeTypes.length > 0) {
    return {
      currentLotteryType: selectedType || activeTypes[activeTypes.length - 1],
      currentInputLength: inputLength,
    };
  }

  return {
    currentLotteryType: "",
    currentInputLength: 3 /* Default to 3 when no types are selected */,
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
