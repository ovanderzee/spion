import { Intelligence, Spion } from './types.js'
import { clone, randomString } from './functions.js'

const createSpion = function (
    api: any,
    functionName: string,
    context?: any,
): Spion {
    const original: Function = api[functionName]
    const replica = clone(original, context)
    const callData: Intelligence[] = []
    const processId = randomString()

    const interceptor = function () {
        const currentIntelligence: Intelligence = {
            args: Array.from(arguments),
            return: replica(...arguments),
        }
        callData.push(currentIntelligence)
        return currentIntelligence.return
    }

    api[functionName] = interceptor

    const debrief = function (): Intelligence[] {
        destroy()
        return report()
    }

    const destroy = function (): void {
        api[functionName] = original
    }

    const report = function (): Intelligence[] {
        return callData
    }

    return {
        debrief: debrief,
        destroy: destroy,
        report: report,
    }
}

export default createSpion
