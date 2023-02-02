import assert from 'node:assert'
import { beforeEach, describe, it } from 'node:test'
import { clone } from '../functions.js'

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
