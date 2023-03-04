
const classMethods = []

class classObject {
    publicMethod() {
        console.log('public method')
    }
    static staticMethod() {
        console.log('static method')
    }
}

classMethods.push(`
    class classObject {
        publicMethod() {
            console.log('public method')
        }
        static staticMethod() {
            console.log('static method')
        }
    }
`)

const classPublicMethodSpion = createSpion(classObject.prototype, 'publicMethod')
classMethods.push('const classPublicMethodSpion = createSpion(classObject.prototype, \'publicMethod\')')

classObject.prototype.publicMethod()
classMethods.push(`classObject.prototype.publicMethod()`)

const classPublicMethodReport = classPublicMethodSpion.report()
classMethods.push('const classPublicMethodReport = classPublicMethodSpion.report()')
console.log(`publicMethod report: `, classPublicMethodReport);
classMethods.push(`// report: ${formattedText(insbject(classPublicMethodReport))}`)


const classStaticMethodSpion = createSpion(classObject, 'staticMethod')
classMethods.push('const classStaticMethodSpion = createSpion(classObject, \'staticMethod\')')

classObject.staticMethod()
classMethods.push(`classObject.staticMethod()`)

const classStaticMethodReport = classStaticMethodSpion.report()
classMethods.push('const classStaticMethodReport = classStaticMethodSpion.report()')
console.log(`staticMethod report: `, classStaticMethodReport);
classMethods.push(`// report: ${formattedText(insbject(classStaticMethodReport))}`)

document.write(`
    <ol>${
    classMethods
        .map(text => listText(text))
        .join('\n')
}</ol>
`)
