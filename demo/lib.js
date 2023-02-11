
const listText = text => {
    return `<li>${text}</li>`
}

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
        } else if (typeof value === 'function') {
            subtext += `${typeof value},\n`
        } else {
            subtext += `${typeof value} = ${value},\n`
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
}

const sleep = (duration) => {
    return new Promise((resolve) => {
        setTimeout(resolve, duration)
    })
}
