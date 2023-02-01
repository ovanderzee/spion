import { Intelligence, Spion } from './types'

const clone = function (original: Function, context: object): Function {
    // Creates a new function, optionally preserving desired context.
    const bound = original.bind(context)
    // Shallow copies over function properties, if any.
    const replica = Object.assign(bound, original)
    return replica
}

const createSpion = function (
    api: any,
    functionName: string,
    context?: any,
): Spion {
    const original: Function = api[functionName]
    const replica = clone(original, context)
    const callData: Intelligence[] = []

    const tracker = function () {
        const currentIntelligence: Intelligence = {
            args: Array.from(arguments),
            return: replica(...arguments),
        }
        callData.push(currentIntelligence)
        return currentIntelligence.return
    }

    api[functionName] = tracker

    const report = function (): Intelligence[] {
        api[functionName] = original
        return callData
    }

    return {
        report: report,
    }
}

export default createSpion
