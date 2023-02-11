const n = 9
const i = 7
const subject = (function () {
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
    const spion1 = createSpion(subject, 'pureAddition')
    console.log('first spion created')
    parallels.push('first spion created')
    await sleep(b)
    subject.pureAddition(1, 1)
    console.log('first subject running')
    parallels.push('first subject running')
    await sleep(c)
    const debrief1 = spion1.report()
    console.log('first spion finished', debrief1)
    parallels.push(`first report: <pre>${insbject(debrief1)}</pre>`)
}

const secondSpion = async function () {
    console.log('second spion')
    parallels.push('second spion')
    await sleep(c)
    const spion2 = createSpion(subject, 'pureAddition')
    console.log('second spion created')
    parallels.push('second spion created')
    await sleep(b)
    subject.pureAddition(2, 2)
    console.log('second subject running')
    parallels.push('second subject running')
    await sleep(a)
    const debrief2 = spion2.report()
    console.log('second spion finished', debrief2)
    parallels.push(`second report: <pre>${insbject(debrief2)}</pre>`)
}

const thirdSpion = async function () {
    console.log('third spion')
    parallels.push('third spion')
    await sleep(b)
    const spion3 = createSpion(subject, 'pureAddition')
    console.log('third spion created')
    parallels.push('third spion created')
    await sleep(a)
    subject.pureAddition(3, 3)
    console.log('third subject running')
    parallels.push('third subject running')
    await sleep(c)
    const debrief3 = spion3.report()
    console.log('third spion finished', debrief3)
    parallels.push(`third report: <pre>${insbject(debrief3)}</pre>`)
}

const finish = async function () {
    await sleep((a+b+c)*2)
    document.getElementById('parallel').innerHTML = `
        <h2>Parallel Example</h2>
        <ol>
            ${parallels.map(
        text => listText(text)
    ).join('\n')}
        </ol>
    `
}

firstSpion()
secondSpion()
thirdSpion()
finish()

