interface Intelligence {
    id?: string;
    args: any[];
    return: any;
}
declare class Spion {
    debrief: () => Intelligence[];
    destroy: () => void;
    report: () => Intelligence[];
}

declare const createSpion: (api: any, functionName: string, context?: any) => Spion;

export { createSpion as default };
