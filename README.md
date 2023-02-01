# spion
Spy-on function, intended to use with the node:test functionality.
Replaces the spied-upon function by an interceptor executing that function in its context
and returning the returned value by that function.

__Note that node:test is usable from nodejs version 18 onwards.__

## Usage
Just call the function with the
api-object, the name of the function and the execution context
to get a ready-to-use object. For instance:
```javascript
import createSpion, { Intelligence, Spion } from 'spion'

const mySpion: Spion = createSpion(api, 'theirMethod', window)
const returnValue = api.theirMethod(arguments)
const report: Intelligence[] = mySpion.report()

assert(
    report[0].args === [...arguments] && report[0].return === returnValue,
    'report should be an array of items holding arguments and return values'
)
```
The execution context is required when testing traditional, contextual functions.
(and may thus be omitted when testing arrow-functions)
The report function will remove the call interceptor and return a Intelligence object

## Demo
/demo/spion.html
