interface Intelligence {
    args: any[];
    return: any;
}
declare class Spion {
    report: () => Intelligence[];
}

declare const createSpion: (api: any, functionName: string, context?: any) => Spion;

export { createSpion as default };
