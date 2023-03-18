export type ContextStore = Record<string, Function>

export const storage = (function () {
    const originals = new Map()

    const checkedReturn = (context: any, functionName: string): Function => {
        const contextStore: ContextStore = originals.get(context) || {}
        if (!(functionName in contextStore)) {
            contextStore[functionName] = context[functionName]
            originals.set(context, contextStore)
        }
        return contextStore[functionName]
    }

    const checkedUnload = (context: any, functionName: string): void => {
        const contextStore: ContextStore = originals.get(context) || {}
        if (functionName in contextStore) {
            delete contextStore[functionName]
            originals.set(context, contextStore)
        }
    }

    const clear = function () {
        originals.clear()
    }

    return {
        clear: clear,
        query: checkedReturn,
        unload: checkedUnload,
    }
})()
