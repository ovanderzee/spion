import { CallInfo, Spion } from './types'

const clone = function (original: Function, context: object): Function {
    // clone function, see https://stackoverflow.com/a/62767649

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
    const callData: CallInfo[] = []

    const tracker = function () {
        const currentCallInfo: CallInfo = {
            args: Array.from(arguments),
            return: replica(...arguments),
        }
        callData.push(currentCallInfo)
        return currentCallInfo.return
    }

    api[functionName] = tracker

    const report = function (): CallInfo[] {
        api[functionName] = original
        return callData
    }

    return {
        report: report,
    }
}

export default createSpion
