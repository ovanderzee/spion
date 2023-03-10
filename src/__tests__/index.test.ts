import assert from 'node:assert'
import { beforeEach, describe, it } from 'node:test'
import createSpion from '../index.js'
import { Intelligence, Spion } from '../types.js'

let subject: any

interface RootContext {
    n: number
    i: number
}

const setRootContext = function (this: any): void {
    this.n = 9
    this.i = 7
    subject = {
        pureAddition: (a: number, b: number): number => a + b,
        contextAddition: (a: number, b: number): void => {
            this.i = a + b
            return this.i
        },
        getContext: (): RootContext => this,
        mixedArrowAddition: (): number => this.i + this.n,
        mixedThisAddition: function (): number {
            return this.i + this.n
        },
    }
}

describe('usage', () => {
    beforeEach(setRootContext)

    it('reporting call parameters', () => {
        const testSpion: Spion = createSpion(subject, 'pureAddition')
        subject.pureAddition(3, 7)
        const report: Intelligence[] = testSpion.report()

        assert(
            report[0].time < 100,
            `report should be made soon after createSpion, was: ${report[0].time}`,
        )
        assert(
            report[0].args[0] === 3,
            `first argument should be 3, was: ${report[0].args[0]}`,
        )
        assert(
            report[0].args[1] === 7,
            `last argument should be 7, was: ${report[0].args[1]}`,
        )
        assert(
            report[0].return === 10,
            `return value should be 10, was: ${report[0].return}`,
        )
    })

    it('report is a data-array', () => {
        const testSpion: Spion = createSpion(subject, 'pureAddition')
        subject.pureAddition(3, 7)
        subject.pureAddition(8, 12)
        subject.pureAddition(13, 17)
        const report: Intelligence[] = testSpion.report()

        assert(
            report.length === 3,
            `after using 3 times, there should be 3 results, was: ${report.length}`,
        )
    })

    it('report ends a spionage session', () => {
        const testSpion: Spion = createSpion(subject, 'pureAddition')
        subject.pureAddition(3, 7)
        subject.pureAddition(8, 12)
        subject.pureAddition(13, 17)
        const report: Intelligence[] = testSpion.report()
        subject.pureAddition(9, 11)
        subject.pureAddition(19, 23)
        const report2: Intelligence[] = testSpion.report()

        assert(
            report.length === 3,
            `after using 3 times, the should be 3 results, was: ${report.length}`,
        )
        assert(report === report2, 'report stops adding data')
    })
})

describe('direct call parameters', () => {
    beforeEach(setRootContext)

    it('determine call arguments', () => {
        const testSpion: Spion = createSpion(subject, 'contextAddition')
        testSpion.withArgs([9, 13])
        subject.contextAddition(3, 7)
        const report: Intelligence[] = testSpion.report()
        const context: RootContext = subject.getContext()

        assert(
            report[0].args[0] === 9 && report[0].args[1] === 13 && report[0].return === 22,
            `function should be called with 9 and 13, was: ${report[0].args.join()}`,
        )
        assert(
            report[0].return === context.i,
            `the cloned function should be executed,
                return: ${report[0].return},
                context: ${context.i}
            `,
        )
    })

    it('determine return value', () => {
        const testSpion: Spion = createSpion(subject, 'contextAddition')
        testSpion.returnValue(7)
        subject.contextAddition(3, 7)
        const report: Intelligence[] = testSpion.report()
        const context: RootContext = subject.getContext()

        assert(
            report[0].args[0] === 3 && report[0].args[1] === 7 && report[0].return === 7,
            `function should be return 7, was: ${report[0].return}`,
        )
        assert(
            report[0].args[0] + report[0].args[1] === context.i,
            `the cloned function should be executed,
                return: ${report[0].return},
                context: ${context.i}
            `,
        )
    })
})

describe('lifecycle integrity', () => {
    beforeEach(setRootContext)

    it('cloned function works like the original function', () => {
        const outputOriginal = subject.pureAddition(2, 9)

        const testSpion: Spion = createSpion(subject, 'pureAddition')
        const outputClone = subject.pureAddition(2, 9)
        testSpion.report()
        const outputAfterwards = subject.pureAddition(2, 9)

        assert(
            outputOriginal === outputAfterwards,
            `original function should work like restored function,
                original: ${outputOriginal},
                restored: ${outputAfterwards},
            `,
        )
        assert(
            outputAfterwards === outputClone,
            `restored function should work like cloned function,
                restored: ${outputAfterwards},
                clone: ${outputClone},
            `,
        )
        assert(
            outputOriginal === outputClone,
            `original function should work like cloned function,
                original: ${outputOriginal},
                clone: ${outputClone},
            `,
        )
    })

    it('quit() restores the original function', () => {
        const referenceOriginal = subject.pureAddition

        const testSpion: Spion = createSpion(subject, 'pureAddition')
        const referenceClone = subject.pureAddition

        assert(
            referenceOriginal !== referenceClone,
            'clone should not be the original',
        )

        testSpion.quit()
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
    const myContext = { i: 11, n: 13 }
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
        testSpion.report()

        assert(
            thisContextAddition === 8,
            `return value should be 8 as in this test-function, was: ${thisContextAddition}`,
        )
    })

    it('arrow-function in test-file context', function (this: any) {
        const testSpion: Spion = createSpion(subject, 'mixedArrowAddition')
        const fileContextAddition = subject.mixedArrowAddition()
        testSpion.report()

        assert(
            fileContextAddition === 16,
            `return value should be 16 as in the root-context-function, was: ${fileContextAddition}`,
        )
    })

    it('contextual-function in test-function context', function (this: any) {
        this.i = 3
        this.n = 5
        const testSpion: Spion = createSpion(subject, 'mixedThisAddition', this)
        const thisContextAddition = subject.mixedThisAddition()
        testSpion.report()

        assert(
            thisContextAddition === 8,
            `return value should be 8 as in this test-function, was: ${thisContextAddition}`,
        )
    })

    it('contextual-function in special context', () => {
        const testSpion: Spion = createSpion(
            subject,
            'mixedThisAddition',
            myContext,
        )
        const fileContextAddition = subject.mixedThisAddition()
        testSpion.report()

        assert(
            fileContextAddition === 24,
            `return value should be 24 as in the added context, was: ${fileContextAddition}`,
        )
    })

    it('context is required for non-arrow functions', () => {
        // only happens in current test setup
        const testSpion: Spion = createSpion(subject, 'mixedThisAddition')
        let noContextAddition!: number
        let report: Intelligence[]
        try {
            noContextAddition = subject.mixedThisAddition()
            report = testSpion.report()
            assert(report.length === 10, 'this condition should not be met')
            assert(
                noContextAddition === 100,
                'this condition should not be met',
            )
        } catch (e) {
            report = testSpion.report()
            assert(report.length === 0, 'nothing should have been recorded')
            assert(
                noContextAddition === undefined,
                'testing a this-function requires a context to be set',
            )
        }
    })
})
