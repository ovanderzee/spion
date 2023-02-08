export const clone = function (original: Function, context?: any): Function {
    // Creates a new function, optionally preserving desired context.
    const bound = original.bind(context)
    // Shallow copies over function properties, if any.
    const replica = Object.assign(bound, original)
    return replica
}

export const randomString = (): string => {
    const integer = Math.round(Math.random() * 10e9)
    return integer.toString(36)
}

export const sleep = (duration: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, duration)
    })
}
