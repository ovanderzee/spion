import assert from 'node:assert'
import { beforeEach, describe, it } from 'node:test'
import createSpion from '../index.js'
import { Intelligence, Spion } from '../types.js'

let subject: any

const setRootContext = function (this: any): void {
    this.n = 9
    this.i = 7
    subject = {
        pureAddition: (a: number, b: number): number => a + b,
        mixedArrowAddition: (): number => this.i + this.n,
        mixedThisAddition: function (): number {
            return this.i + this.n
        },
    }
}

describe('usage', () => {
    beforeEach(setRootContext)

    it('debriefing call parameters', () => {
        const testSpion: Spion = createSpion(subject, 'pureAddition')
        subject.pureAddition(3, 7)
        const debrief: Intelligence[] = testSpion.debrief()

        assert(
            debrief[0].args[0] === 3,
            `first argument should be 3, was: ${debrief[0].args[0]}`,
        )
        assert(
            debrief[0].args[1] === 7,
            `last argument should be 7, was: ${debrief[0].args[1]}`,
        )
        assert(
            debrief[0].return === 10,
            `return value should be 10, was: ${debrief[0].return}`,
        )
    })

    it('debrief is a data-array', () => {
        const testSpion: Spion = createSpion(subject, 'pureAddition')
        subject.pureAddition(3, 7)
        subject.pureAddition(8, 12)
        subject.pureAddition(13, 17)
        const debrief: Intelligence[] = testSpion.debrief()

        assert(
            debrief.length === 3,
            'after using 3 times, the should be 3 results',
        )
    })

    it('debrief ends a spionage session', () => {
        const testSpion: Spion = createSpion(subject, 'pureAddition')
        subject.pureAddition(3, 7)
        subject.pureAddition(8, 12)
        subject.pureAddition(13, 17)
        const debrief: Intelligence[] = testSpion.debrief()
        subject.pureAddition(9, 11)
        subject.pureAddition(19, 23)
        const debrief2: Intelligence[] = testSpion.debrief()

        assert(
            debrief.length === 3,
            'after using 3 times, the should be 3 results',
        )
        assert(debrief === debrief2, 'debrief stops adding data')
    })
})

describe('lifecycle integrity', () => {
    beforeEach(setRootContext)

    it('cloned function works like the original function', () => {
        const outputOriginal = subject.pureAddition(2, 9)

        const testSpion: Spion = createSpion(subject, 'pureAddition')
        const outputClone = subject.pureAddition(2, 9)
        testSpion.debrief()
        const outputAfterwards = subject.pureAddition(2, 9)

        assert(
            outputOriginal === outputAfterwards,
            'original function should work like restored function',
        )
        assert(
            outputAfterwards === outputClone,
            'restored function should work like cloned function',
        )
        assert(
            outputOriginal === outputClone,
            'original function should work like cloned function',
        )
    })

    it('debrief() restores the original function', () => {
        const referenceOriginal = subject.pureAddition

        const testSpion: Spion = createSpion(subject, 'pureAddition')
        const referenceClone = subject.pureAddition

        assert(
            referenceOriginal !== referenceClone,
            'clone should not be the original',
        )

        testSpion.debrief()
        const referenceAfterwards = subject.pureAddition

        assert(
            referenceOriginal === referenceAfterwards,
            'original should be restored',
        )
        assert(
            referenceAfterwards !== referenceClone,
            'clone should be removed from object',
        )
        assert(
            referenceOriginal !== referenceClone,
            'clone should not be the original after restore',
        )
    })
})

describe('testing functions', () => {
    let myContext = { i: 11, n: 13 }
    beforeEach(setRootContext)

    it('arrow-function in test-function context', function (this: any) {
        this.i = 3
        this.n = 5
        const testSpion: Spion = createSpion(
            subject,
            'mixedArrowAddition',
            myContext,
        )
        const thisContextAddition = subject.mixedArrowAddition()
        testSpion.debrief()

        assert(
            thisContextAddition === 8,
            `return value should be 8, was: ${thisContextAddition}`,
        )
    })

    it('arrow-function in test-file context', function (this: any) {
        const testSpion: Spion = createSpion(subject, 'mixedArrowAddition')
        const fileContextAddition = subject.mixedArrowAddition()
        testSpion.debrief()

        assert(
            fileContextAddition === 16,
            `return value should be 16, was: ${fileContextAddition}`,
        )
    })

    it('contextual-function in test-function context', function (this: any) {
        this.i = 3
        this.n = 5
        const testSpion: Spion = createSpion(subject, 'mixedThisAddition', this)
        const thisContextAddition = subject.mixedThisAddition()
        testSpion.debrief()

        assert(
            thisContextAddition === 8,
            `return value should be 8, was: ${thisContextAddition}`,
        )
    })

    it('contextual-function in special context', () => {
        const testSpion: Spion = createSpion(
            subject,
            'mixedThisAddition',
            myContext,
        )
        const fileContextAddition = subject.mixedThisAddition()
        testSpion.debrief()

        assert(
            fileContextAddition === 24,
            `return value should be 24, was: ${fileContextAddition}`,
        )
    })

    it('context is required for non-arrow functions', () => {
        // only happens in current test setup
        const testSpion: Spion = createSpion(subject, 'mixedThisAddition')
        let noContextAddition!: number
        let debrief: Intelligence[]
        try {
            noContextAddition = subject.mixedThisAddition()
            debrief = testSpion.debrief()
            assert(debrief.length === 10, 'this condition should not be met')
            assert(
                noContextAddition === 100,
                'this condition should not be met',
            )
        } catch (e) {
            debrief = testSpion.debrief()
            assert(debrief.length === 0, 'nothing should have been recorded')
            assert(
                noContextAddition === undefined,
                'testing a this-function requires a context to be set',
            )
        }
    })
})
