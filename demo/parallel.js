const n = 9
const i = 7
const parallelSubject = (function () {
    return {
        pureAddition: (a, b) => a + b,
        mixedArrowAddition: () => i + n,
        mixedThisAddition: function () {
            return i + n
        },
    }
})()
const a = 10
const b = 15
const c = 18

const parallels = []

const firstSpion = async function () {
    console.log('first spion')
    parallels.push('first spion')
    await sleep(a)
    const spion1 = createSpion(parallelSubject, 'pureAddition')
    console.log('first spion created')
    parallels.push('first spion created')
    await sleep(b)
    parallelSubject.pureAddition(1, 1)
    console.log('first parallelSubject running')
    parallels.push('first parallelSubject running')
    await sleep(c)
    const debrief1 = spion1.report(spion1.processId)
    console.log('first spion finished', debrief1)
    parallels.push(`first report: <pre>${insbject(debrief1)}</pre>`)
}

const secondSpion = async function () {
    console.log('second spion')
    parallels.push('second spion')
    await sleep(c)
    const spion2 = createSpion(parallelSubject, 'pureAddition')
    console.log('second spion created')
    parallels.push('second spion created')
    await sleep(b)
    parallelSubject.pureAddition(2, 2)
    console.log('second parallelSubject running')
    parallels.push('second parallelSubject running')
    await sleep(a)
    const debrief2 = spion2.report(spion2.processId)
    console.log('second spion finished', debrief2)
    parallels.push(`second report: <pre>${insbject(debrief2)}</pre>`)
}

const thirdSpion = async function () {
    console.log('third spion')
    parallels.push('third spion')
    await sleep(b)
    const spion3 = createSpion(parallelSubject, 'pureAddition')
    console.log('third spion created')
    parallels.push('third spion created')
    await sleep(a)
    parallelSubject.pureAddition(3, 3)
    console.log('third parallelSubject running')
    parallels.push('third parallelSubject running')
    await sleep(c)
    const debrief3 = spion3.report(spion3.processId)
    console.log('third spion finished', debrief3)
    parallels.push(`third report: <pre>${insbject(debrief3)}</pre>`)
}

const finish = async function () {
    await sleep((a+b+c)*2)
    document.write(`
        <ol>${
            parallels
                .map(text => listText(text))
                .join('\n')
        }</ol>
    `)
}

firstSpion()
secondSpion()
thirdSpion()
finish()

