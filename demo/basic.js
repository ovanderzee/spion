
const basics = []

const logSpion = createSpion(console, 'log', this)
basics.push('const logSpion = createSpion(console, \'log\', this)')
basics.push(`logSpion: <pre>${insbject(logSpion)}</pre>`)

console.log('Hello')
basics.push(`console.log('Hello')`)
console.log('I heard a lot about you!')
basics.push(`console.log('I heard a lot about you!')`)

const report = logSpion.debrief()
basics.push('const report = logSpion.debrief()')
console.info(report) // 4 Intelligence items
basics.push(`report: <pre>${insbject(report)}</pre>`)

document.write(`
    <section id="basic">
        <h2>Basic Example</h2>
        <ol>
            ${basics.map(
                text => listText(text)
            ).join('\n')}
        </ol>
    </section>
`)
