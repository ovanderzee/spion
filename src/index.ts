import { Intelligence, Direction, Spion } from './types.js'
import { clone, randomString } from './functions.js'

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
    const processId = randomString()

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
            id: processId,
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

    const report = (reportId?: string): Intelligence[] => {
        quit()
        if (!reportId) {
            return callData
        }
        const filteredCallData = callData.filter((cd) => cd.id === reportId)
        const mappedCallData = filteredCallData.map((cd) => {
            delete cd.id
            return cd
        })
        return filteredCallData
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
