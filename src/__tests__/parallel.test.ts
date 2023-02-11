import assert from 'node:assert'
import { describe, it } from 'node:test'
import createSpion from '../index.js'
import { sleep } from '../functions.js'
import { Intelligence, Spion } from "../types";

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
const e = 20

const originalFunction = subject.pureAddition;

const spion: Spion[] = []
const report: Intelligence[][] = []

const firstSpion = async () => {
    await sleep(a)
    spion[0] = createSpion(subject, 'pureAddition')
    await sleep(b)
    subject.pureAddition(1,1)
    await sleep(c)
    report[0] = spion[0].report()
}

const secondSpion = async () => {
    await sleep(c)
    spion[1] = createSpion(subject, 'pureAddition')
    await sleep(b)
    subject.pureAddition(2,2)
    await sleep(a)
    report[1] = spion[1].report()
}

const thirdSpion = async () => {
    await sleep(b)
    spion[2] = createSpion(subject, 'pureAddition')
    await sleep(a)
    subject.pureAddition(3,3)
    await sleep(c)
    report[2] = spion[2].report()
}

describe('running in parallel', { only: true },function () {

    it('test all spion ionstances', async () => {
        firstSpion()
        secondSpion()
        thirdSpion()

        await sleep(a+b+c+e)
        // assert(
        //     report[0][0].return === 2,
        //     `first return-value should be 2, was: ${report[0][0].return}`,
        // )
        // assert(
        //     report[0].length === 1,
        //     `first spion should have found one call, was: ${report[0].length}`,
        // )

        // assert(
        //     report[1][0].return === 4,
        //     `second return-value should be 4, was: ${report[1][0].return}`,
        // )
        // assert(
        //     report[1].length === 1,
        //     `second spion should have found one call, was: ${report[1].length}`,
        // )

        // assert(
        //     report[2][0].return === 6,
        //     `third return-value should be 6, was: ${report[2][0].return}`,
        // )
        // assert(
        //     report[2].length === 1,
        //     `third spion should have found one call, was: ${report[2].length}`,
        // )
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
