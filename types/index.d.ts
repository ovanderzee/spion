interface Intelligence {
    args: any[];
    return: any;
    time: number;
}
declare class Spion {
    report: () => Intelligence[];
    quit: () => void;
    withArgs: (args: any) => void;
    returnValue: (args: any) => void;
}

declare const createSpion: (api: any, functionName: string, context?: any) => Spion;

export { createSpion as default };
