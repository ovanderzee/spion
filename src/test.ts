import assert from 'node:assert'
import { beforeEach, test } from 'node:test'
import createSpion from './index.js'
import { CallInfo, Spion } from './types.js'

let subject: any

beforeEach(() => {
    subject = {
        pureAddition: (a: number, b: number): number => a + b,
    }
})

test('simple usage', () => {
    const testSpion: Spion = createSpion(subject, 'pureAddition', null)
    subject.pureAddition(3, 7)
    subject.pureAddition(8, 12)
    subject.pureAddition(13, 17)
    const report: CallInfo[] = testSpion.report()

    assert(report.length === 3, 'after using 3 times, the should be 3 results')
})

test('report; returns call parameters', () => {
    const testSpion: Spion = createSpion(subject, 'pureAddition', null)
    subject.pureAddition(3, 7)
    const report: CallInfo[] = testSpion.report()

    assert(report[0].args[0] === 3, `first argument should be 3, was: ${report[0].args[0]}`)
    assert(report[0].args[1] === 7, `last argument should be 7, was: ${report[0].args[1]}`)
    assert(report[0].return === 10, `return value should be 10, was: ${report[0].return}`)
})

test('lifecycle; report() restores the original function', () => {
    const referenceOriginal = subject.pureAddition

    const testSpion: Spion = createSpion(subject, 'pureAddition', null)
    const referenceClone = subject.pureAddition

    assert(referenceOriginal !== referenceClone, 'clone should not be the original')

    testSpion.report()
    const referenceAfterwards = subject.pureAddition

    assert(referenceOriginal === referenceAfterwards, 'original should be restored')
    assert(referenceAfterwards !== referenceClone, 'clone should be removed from object')
    assert(referenceOriginal !== referenceClone, 'clone should not be the original after restore')
})

