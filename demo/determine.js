
const determs = []

const subject = (function () {
    return {
        adding: (a, b) => a + b
    }
})()
determs.push(`
    const subject = (function () {
        return {
            adding: (a, b) => a + b
        }
    })()
`)

const determSpion = createSpion(subject, 'adding')
determs.push('const determSpion = createSpion(subject, \'adding\')')

subject.adding(7, 9)
determs.push(`subject.adding(7, 9)`)

determSpion.withArgs([2, 3])
determs.push(`determSpion.withArgs([2, 3])`)
subject.adding(7, determSpion)
determs.push(`subject.adding(7, 9)`)

determSpion.returnValue(11)
determs.push(`determSpion.returnValue(11)`)
subject.adding(7, 9)
determs.push(`subject.adding(7, 9)`)

const determReport = determSpion.report()
determs.push('const determReport = determSpion.report()')
console.log(`determination: `, determReport);
determs.push(`// report: ${formattedText(insbject(determReport))}`)

document.getElementById('determine').innerHTML += `
    <ol>${
        determs
            .map(text => listText(text))
            .join('\n')
    }</ol>
`
