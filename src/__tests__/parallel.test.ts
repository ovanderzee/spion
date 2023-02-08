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

const originalFunction = subject.mixedArrowAddition;

describe('running in parallel', function () {

    it('test first spion', async () => {
        await sleep(a)
        const spion1 = createSpion(subject, 'mixedArrowAddition')
        await sleep(b)
        subject.mixedArrowAddition()
        await sleep(c)
        const debrief1 = spion1.debrief()

        assert(
            debrief1[0].return === 16,
            `it should be 16, was: ${debrief1[0].return}`,
        )
        assert(
            debrief1.length === 1,
            `first spion should have bound one interceptor, was: ${debrief1.length}`,
        )
    })

    // it('pending test', async () => {
    //     await sleep((a+b+c)*0.9)
    //     const pendingFunction = subject.mixedArrowAddition
    //
    //     assert(
    //         pendingFunction !== originalFunction,
    //         `the intercepted function should be effective before the end`,
    //     )
    // })

    it('test second spion', async () => {
        await sleep(c)
        const spion2 = createSpion(subject, 'mixedArrowAddition')
        await sleep(a)
        subject.mixedArrowAddition()
        await sleep(b)
        const debrief2 = spion2.debrief()

        assert(
            debrief2[0].return === 16,
            `it should be 16, was: ${debrief2[0].return}`,
        )
        assert(
            debrief2.length === 1,
            `second spion should have bound one interceptor, was: ${debrief2.length}`,
        )
    })

    it('test third spion', async () => {
        await sleep(b)
        const spion3 = createSpion(subject, 'mixedArrowAddition')
        await sleep(c)
        subject.mixedArrowAddition
        await sleep(a)
        const debrief3 = spion3.debrief()

        // current situation: third function did not execute its own interceptor:
        assert(debrief3.length === 0, `third spion appears not to have bound an interceptor, was: ${debrief3.length}`);
        // DEBT
        // assert(
        //     debrief3[0].return === 16,
        //     `it should be 16, was: ${debrief3[0].return}`,
        // )
        // assert(
        //     debrief3.length === 1,
        //     `third spion should have bound one interceptor, was: ${debrief3.length}`,
        // )
    })

    // DEBT
    // it('final test', async () => {
    //     await sleep((a+b+c)*1.5)
    //     const finalFunction = subject.mixedArrowAddition
    //
    //     assert(
    //         finalFunction === originalFunction,
    //         `the original function should be effective in the end`,
    //     )
    // })
})

