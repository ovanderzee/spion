import { Intelligence, Direction, Spion } from './types.js'
import { clone } from './functions.js'

const createSpion = function (
    api: any,
    functionName: string,
    context?: any,
): Spion {
    const original: Function = api[functionName]
    const replica = clone(original, context)
    const callDirection: Direction = {}
    const callData: Intelligence[] = []
    const start = performance.now()

    const interceptor = function () {
        const args =
            'withArgs' in callDirection ? callDirection.withArgs : arguments
        const returnValue = replica(...args)
        const currentIntelligence: Intelligence = {
            args: Array.from(args),
            return:
                'returnValue' in callDirection
                    ? callDirection.returnValue
                    : returnValue,
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

    const withArgs = (args: any[]): void => {
        callDirection.withArgs = args
    }

    const returnValue = (value: any): void => {
        callDirection.returnValue = value
    }

    return {
        report: report,
        quit: quit,
        withArgs: withArgs,
        returnValue: returnValue,
    }
}

export default createSpion
