let tempIdCounter = 0;

export const betUtils = {
    generateTempId(): string {
        return `temp_${Date.now()}_${tempIdCounter++}`;
    },
};