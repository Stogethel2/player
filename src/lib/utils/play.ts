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


export function getTypeClass(tag: string): string {
    if (tag.startsWith("2-")) {
        return "bg-yellow-600 text-white";
    }
    return "bg-red-600 text-white";
}


export function togglePlayMode(
    currentMode: boolean,
    mode: "custom" | "selector"
): boolean {
    return mode === "custom";
}
