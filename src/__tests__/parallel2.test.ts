import assert from 'node:assert'
import { describe, it } from 'node:test'

describe('what remains 2', function () {
    it('test the action in the previous file', function () {
        assert(
            console.error !== console.log,
            'in the subsequent file, console.log should not be replaced anymore'
        )
    })
})
