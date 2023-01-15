export interface CallInfo {
    args: any[]
    return: any
}

export class Spion {
    report!: () => CallInfo[]
}
