const clone = function(original, context) {
  const bound = original.bind(context);
  const replica = Object.assign(bound, original);
  return replica;
};

const createSpion = function(api, functionName, context) {
  const original = api[functionName];
  const replica = clone(original, context);
  const callData = [];
  const start = performance.now();
  const interceptor = function() {
    const currentIntelligence = {
      args: Array.from(arguments),
      return: replica(...arguments),
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
  return {
    report,
    quit
  };
};

export { createSpion as default };
//# sourceMappingURL=createSpion.js.map
