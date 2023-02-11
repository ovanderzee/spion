
const listText = text => {
    return `<li>${text}</li>`
};

const insbject = (obj, depth = 0) => {
    const isArray = Array.isArray(obj)
    const openSign = isArray ? '[' : '{'
    const initalIdent = Array(depth * 4).join(' ')

    let text = `${openSign}\n`
    const bodyIdent = Array(++depth * 4).join(' ')

    const loop = (key, value) => {
        let subtext = `${bodyIdent}${key}: `
        if (typeof value === 'object') {
            subtext += `${insbject(value, depth)}`
        } else {
            subtext += `${typeof value},\n`
        }
        return subtext
    }

    if (isArray) {
        for (const [k, v] of obj.entries()) {
            text += loop(k,v)
        }
    } else {
        Object.entries(obj)
            .map(([k, v]) => text += loop(k,v))
    }

    const closeSign = isArray ? ']' : '}'
    text += `${initalIdent}${closeSign},\n`

    return text
};

const texts = []

const logSpion = createSpion(console, 'log', this)
texts.push('const logSpion = createSpion(console, \'log\', this)')
texts.push(`logSpion: <pre>${insbject(logSpion)}</pre>`)

console.log('Hello');
texts.push(`console.log('Hello')`)
console.log('I heard a lot about you!');
texts.push(`console.log('I heard a lot about you!');`)

const report = logSpion.debrief()
texts.push('const report = logSpion.debrief()')
console.info(report); // 4 Intelligence items
texts.push(`report: <pre>${insbject(report)}</pre>`)

document.write(`
    <section id="basic">
        <h2>Basic Example</h2>
        <ol>
            ${texts.map(
                text => listText(text)
            ).join('\n')}
        </ol>
    </section>
`)
