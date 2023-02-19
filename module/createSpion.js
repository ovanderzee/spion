const clone = function(original, context) {
  const bound = original.bind(context);
  const replica = Object.assign(bound, original);
  return replica;
};

const createSpion = function(api, functionName, context) {
  const original = api[functionName];
  const replica = clone(original, context);
  const callDirection = {};
  const callData = [];
  const start = performance.now();
  const interceptor = function() {
    const args = "withArgs" in callDirection ? callDirection.withArgs : arguments;
    const returnValue2 = replica(...args);
    const currentIntelligence = {
      args: Array.from(args),
      return: "returnValue" in callDirection ? callDirection.returnValue : returnValue2,
      time: performance.now() - start
    };
    callData.push(currentIntelligence);
    return currentIntelligence.return;
  };
  api[functionName] = interceptor;
  const quit = () => {
    if (api[functionName] !== original) {
      api[functionName] = original;
    }
  };
  const report = () => {
    quit();
    return callData;
  };
  const withArgs = (args) => {
    callDirection.withArgs = args;
  };
  const returnValue = (value) => {
    callDirection.returnValue = value;
  };
  return {
    report,
    quit,
    withArgs,
    returnValue
  };
};

export { createSpion as default };
//# sourceMappingURL=createSpion.js.map
