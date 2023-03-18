import { Intelligence, Direction, Spion } from './types.js'
import { clone } from './functions.js'
import { MethodStore, storage } from './storage'

const createSpion = function (
    api: any,
    functionName: string,
    context?: any,
): Spion {
    const store: MethodStore = storage.query(api, functionName)
    const replica = clone(store.origin, context)
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
        const outstanding = storage.unload(api, functionName)
        if (!outstanding) {
            api[functionName] = store.origin
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
