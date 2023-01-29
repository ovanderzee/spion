export interface Intelligence {
    args: any[]
    return: any
}

export class Spion {
    report!: () => Intelligence[]
}
