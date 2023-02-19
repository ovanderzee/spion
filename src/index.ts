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
    const start = performance.now()

    const interceptor = function () {
        const currentIntelligence: Intelligence = {
            args: Array.from(arguments),
            return: replica(...arguments),
            time: performance.now() - start,
        }
        callData.push(currentIntelligence)
        return currentIntelligence.return
    }

    api[functionName] = interceptor

    const quit = (): void => {
        if (api[functionName] !== original) {
            api[functionName] = original
        }
    }

    const report = (): Intelligence[] => {
        quit()
        return callData
    }

    return {
        report: report,
        quit: quit,
    }
}

export default createSpion
