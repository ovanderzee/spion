import assert from 'node:assert'
import { describe, it } from 'node:test'
import createSpion from '../index.js'
import { sleep } from '../functions.js'

let subject: any

const setRootContext = (function (this: any): void {
    const n = 9
    const i = 7
    subject = {
        pureAddition: (a: number, b: number): number => a + b,
        mixedArrowAddition: (): number => i + n,
        mixedThisAddition: function (): number {
            return i + n
        },
    }
})()

const a = 10
const b = 15
const c = 18

const originalFunction = subject.pureAddition;

describe('running in parallel', { only: true },function () {

    it('test first spion', async () => {
        await sleep(a)
        const spion1 = createSpion(subject, 'pureAddition')
        await sleep(b)
        subject.pureAddition(1,1)
        await sleep(c)
        const debrief1 = spion1.report()

        assert(
            debrief1[0].return === 2,
            `first return-value should be 2, was: ${debrief1[0].return}`,
        )
        assert(
            debrief1.length === 1,
            `first spion should have found one call, was: ${debrief1.length}`,
        )
    })

    it('pending test', async () => {
        await sleep((a+b+c)*0.9)
        const pendingFunction = subject.pureAddition

        assert(
            pendingFunction !== originalFunction,
            `the intercepted function should be effective before the end`,
        )
    })

    it('test second spion', async () => {
        await sleep(c)
        const spion2 = createSpion(subject, 'pureAddition')
        await sleep(a)
        subject.pureAddition(2,2)
        await sleep(b)
        const debrief2 = spion2.report()

        assert(
            debrief2[0].return === 4,
            `second return-value should be 4, was: ${debrief2[0].return}`,
        )
        assert(
            debrief2.length === 1,
            `second spion should have found one call, was: ${debrief2.length}`,
        )
    })

    it('test third spion', async () => {
        await sleep(b)
        const spion3 = createSpion(subject, 'pureAddition')
        await sleep(c)
        subject.pureAddition(3,3)
        await sleep(a)
        const debrief3 = spion3.report()

        // current situation: third function did not execute its own interceptor:
        // assert(debrief3.length === 0, `third spion appears not to have bound an interceptor, was: ${debrief3.length}`);
        // DEBT
        assert(
            debrief3[0].return === 6,
            `third return-value should be 6, was: ${debrief3[0].return}`,
        )
        assert(
            debrief3.length === 1,
            `third spion should have found one call, was: ${debrief3.length}`,
        )
    })

    // DEBT
    // it('final test', async () => {
    //     await sleep((a+b+c)*1.5)
    //     const finalFunction = subject.pureAddition
    //
    //     assert(
    //         finalFunction === originalFunction,
    //         `the original function should be effective in the end`,
    //     )
    // })
})

describe('what remains', function () {
    let originalAtDescribe: Function

    it('sets a reference to a common object', function () {
        originalAtDescribe = console.log
        console.log = console.error

        assert(
            !!originalAtDescribe,
            'console.log should be saved'
        )
    })

    it('test the action in the previous test', function () {
        assert(
            originalAtDescribe !== console.log,
            'original console.log should not be found'
        )

        assert(
            console.error === console.log,
            'in the subsequent test, console.log should still be replaced'
        )
    })
})

describe('what remains later', function () {
    it('test the action in the previous describe', function () {
        assert(
            console.error === console.log,
            'in the subsequent describe, console.log should still be replaced'
        )
    })
})
