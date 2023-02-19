export interface Intelligence {
    args: any[]
    return: any
    time: number
}

export interface Direction {
    withArgs?: any
    returnValue?: any
}

export class Spion {
    report!: () => Intelligence[]
    quit!: () => void
    withArgs!: (args: any) => void
    returnValue!: (args: any) => void
}
