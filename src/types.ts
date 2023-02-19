export interface Intelligence {
    args: any[]
    return: any
    time: number
}

export class Spion {
    report!: () => Intelligence[]
    quit!: () => void
}
