# spion
Spy-on function, intended to use with the node:test functionality.
Wraps the spied-upon function in an interceptor
letting the function execute and return normally within its context.

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
    report[0].args === [arg1, arg2] &&
    report[0].return === returnValue &&
    report[0].time < 10,
    'report should be an array of items holding arguments, return values and time after createSpion'
)

// after all tests ended
after(() => {
    mySpion.quit()
})
```
* The execution context is required when testing traditional, contextual functions.
(and may thus be omitted when testing arrow-functions)
* The __report__ method will remove the call interceptor and return a Intelligence object
* The __quit__ method ensures the interceptor is removed (normally not needed)

### Direction
The calling arguments and the returning value can be determined.
* The __withArgs__ method will call the interceptor with specified arguments
* The __returnValue__ method will let the interceptor return with the specified value

Works as ES-module or CommonJS-module, and in the browser

## Demo
/demo/spion.html
