
const basics = []

const basicSpion = createSpion(console, 'info', document)
basics.push('const basicSpion = createSpion(console, \'info\', this)')
basics.push(`// Spion methods: ${formattedText(insbject(basicSpion))}`)

console.info('Hello');
basics.push(`console.info('Hello')`)
console.info('I heard a lot about you!');
basics.push(`console.info('I heard a lot about you!');`)

const basicReport = basicSpion.report()
basics.push('const basicReport = basicSpion.report()')
console.log(`basic: `, basicReport);
basics.push(`// report: ${formattedText(insbject(basicReport))}`)

document.write(`
    <ol>${
        basics
            .map(text => listText(text))
            .join('\n')
    }</ol>
`)
