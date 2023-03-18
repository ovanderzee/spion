import assert from 'node:assert'
import { beforeEach, describe, it } from 'node:test'
import { MethodStore, storage } from '../storage.js'
import createSpion from "../index";

describe('storage query', () => {
    beforeEach(storage.clear)

    it('should store for a new api', () => {
        const original = console.log
        const stored = storage.query(console, 'log')

        assert(
            original === stored,
            'original and stored should be identical',
        )
    })

    it('should store for a known api', () => {
        const original = console.error
        const stored = storage.query(console, 'error')

        assert(
            original === stored,
            'original and stored should be identical',
        )
    })

    it('should not store a method already spied upon', () => {
        const found = console.info
        createSpion(console, 'info')
        const stored = storage.query(console, 'info')

        assert(
            found !== stored,
            'found and stored should not be identical',
        )
    })
})

describe('storage unload', () => {
    let stateCE: MethodStore

    beforeEach(() => {
        storage.clear()
        storage.query(console, 'log')
        storage.query(console, 'log')
        storage.query(console, 'log')
        stateCE = storage.query(console, 'error')
    })

    it('should lower and return the number of outstanding spies', () => {
        const outstanding = storage.unload(console, 'log')

        assert(
            outstanding === 2,
            `two outstanding spies should be reported, was: ${outstanding}`,
        )
    })

    it('unloading the last interceptor for a method should remove the file for that method', () => {
        const outstanding = storage.unload(console, 'error')

        assert(
            outstanding === 0,
            `no outstanding spies should be reported, was: ${outstanding}`,
        )
        // assert(!stateCE, `the file for the method should be gone, was: ${JSON.stringify(eIdQuery)}`)
    })
})

describe('storage clear', () => {
    beforeEach(() => {
        storage.clear()
        storage.query(console, 'log')
        storage.query(console, 'log')
    })

    it('should clear all kept data', () => {
        const stateN = storage.query(console, 'log')
        storage.clear()
        const outstandingC = storage.unload(console, 'log')
        const stateC = storage.query(console, 'log')

        assert(
            stateN.load > stateC.load && stateC.load === 1,
            `a new query reveals a first load , was: ${stateC.load}`,
        )

        assert(
            outstandingC === 0,
            `unload after clear is zero, was: ${outstandingC}`,
        )
    })
})
