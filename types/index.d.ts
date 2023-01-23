interface CallInfo {
    args: any[];
    return: any;
}
declare class Spion {
    report: () => CallInfo[];
}

declare const createSpion: (api: any, functionName: string, context: any) => Spion;

export { createSpion as default };
