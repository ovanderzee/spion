function clone (object, functionName, context) {
    // clone function, see https://stackoverflow.com/a/62767649
    const pristineFunction = object[functionName]
    // Creates a new function, optionally preserving desired context.
    const boundFunction = pristineFunction.bind(context)
    // Shallow copies over function properties, if any.
    const standInFunction = Object.assign(boundFunction, pristineFunction)
    return standInFunction
}

function Spion (object, functionName, context = this) {
    const self = this
    const standIn = clone(object, functionName, context)
    this.callCount = 0
    this.args = []

    const tracker = function () {
        ++self.callCount
        self.args.push(Array.from(arguments).join())
        standIn(...arguments)
        console.info(self.callCount, self.args.join())
    }

    object[functionName] = tracker
}
