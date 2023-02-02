import { Intelligence, Spion } from './types.js'
import { clone } from './functions.js'

const createSpion = function (
    api: any,
    functionName: string,
    context?: any,
): Spion {
    const original: Function = api[functionName]
    const replica = clone(original, context)
    const callData: Intelligence[] = []

    const interceptor = function () {
        const currentIntelligence: Intelligence = {
            args: Array.from(arguments),
            return: replica(...arguments),
        }
        callData.push(currentIntelligence)
        return currentIntelligence.return
    }

    api[functionName] = interceptor

    const report = function (): Intelligence[] {
        api[functionName] = original
        return callData
    }

    return {
        report: report,
    }
}

export default createSpion
