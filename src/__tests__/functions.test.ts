import assert from 'node:assert'
import { beforeEach, describe, it } from 'node:test'
import { clone, sleep } from '../functions.js'

let originalFunction: Function, cloneFunction: Function

const context = {
    i: 13,
    n: 11,
}

const contextualFunction = function (a: number,b: number): number {
    return a > b ? a : b
}

const arrowFunction = (a: number,b: number): number => a > b ? a : b


describe('cloning', () => {
    beforeEach(function () {
        originalFunction = arrowFunction
        cloneFunction = clone(originalFunction)
    })

    it('original and cloned function should not be identical', () => {
        assert(
            originalFunction !== cloneFunction,
            'original function should not be the cloned function',
        )
    })

    it('cloned function should work the same as the original function', () => {
        const outputOriginal = originalFunction(2, 9)
        const outputClone = cloneFunction(2, 9)

        assert(
            outputOriginal === outputClone,
            'original function should work like cloned function',
        )
    })
})

describe('timers', () => {
    let sleepResult = ''

    it('first execution sequence', async () => {
        setTimeout(() => { sleepResult += '1' }, 90)
        setTimeout(() => { sleepResult += '3' }, 110)
        await sleep(100)
        sleepResult += '2'
        // time here is 100, complete +3
        await sleep(10)

        assert(
            sleepResult === '123',
            `sleep should be the async setTimeout flattener (first), was: ${sleepResult}`,
        )
    })

    it('quicker execution sequence', async () => {
        setTimeout(() => { sleepResult += 'a' }, 40)
        setTimeout(() => { sleepResult += 'c' }, 60)
        await sleep(50)
        sleepResult += 'b'
        // time here is 50, complete +c
        await sleep(10)

        assert(
            sleepResult === '123abc',
            `async processes should be able to affect one another, was: ${sleepResult}`,
        )
    })

})
