export const clone = function (original: Function, context?: any): Function {
    // Creates a new function, optionally preserving desired context.
    const bound = original.bind(context)
    // Shallow copies over function properties, if any.
    const replica = Object.assign(bound, original)
    return replica
}

export const sleep = (duration: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, duration)
    })
}
