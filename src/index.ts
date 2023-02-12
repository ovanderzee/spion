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
            id: processId,
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
        const filteredCallData = callData.filter((cd) => cd.id === processId)
        const mappedCallData = filteredCallData.map((cd) => {
            delete cd.id
            return cd
        })
        return mappedCallData
    }

    return {
        debrief: debrief,
        destroy: destroy,
        report: report,
    }
}

export default createSpion
