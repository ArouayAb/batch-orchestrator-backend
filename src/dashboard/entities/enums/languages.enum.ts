export enum Language {
    JAVASCRIPT = "JAVASCRIPT",
    GO = "GO",
    PYTHON = "PYTHON"
}

export function fromNameToValue(name: string) {
    switch(name) {
        case "JAVASCRIPT":
            return Language.JAVASCRIPT;
        case "GO":
            return Language.GO;
        case "PYTHON":
            return Language.PYTHON;
        default:
            return undefined;
    }
}