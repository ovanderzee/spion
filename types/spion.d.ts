interface CallInfo {
    args: any[];
    return: any;
}
declare class Spion {
    report: () => CallInfo[];
}

declare const spion: (api: any, functionName: string, context: any) => Spion;

export { spion as default };
