# spion
Spy-on function, intended to use with the node:test functionality.
Replaces the spied-upon function by an interceptor
letting the function execute and return normally within its context.

__Note that node:test is usable from nodejs v18.8.0, or v16.18.0 onwards.__

## Usage
Just call the function with the
api-object, the name of the function and the execution context
to get a ready-to-use object. For instance:
```javascript
import createSpion, { Intelligence, Spion } from 'spion'

const mySpion: Spion = createSpion(api, 'theirMethod', window)
const returnValue = api.theirMethod(arg1, arg2)
const report: Intelligence[] = mySpion.report()

assert(
    report[0].args === [arg1, arg2] && report[0].return === returnValue,
    'report should be an array of items holding arguments and return values'
)
```
The execution context is required when testing traditional, contextual functions.
(and may thus be omitted when testing arrow-functions)
The report function will remove the call interceptor and return a Intelligence object

Works as ES-module or CommonJS-module, and in the browser

## Demo
/demo/spion.html
