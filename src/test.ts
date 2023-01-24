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
