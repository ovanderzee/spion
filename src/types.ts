export interface Intelligence {
    args: any[]
    return: any
}

export class Spion {
    debrief!: () => Intelligence[]
    destroy!: () => void
    report!: () => Intelligence[]
}
