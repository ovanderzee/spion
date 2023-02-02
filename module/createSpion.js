const clone = function(original, context) {
  const bound = original.bind(context);
  const replica = Object.assign(bound, original);
  return replica;
};

const createSpion = function(api, functionName, context) {
  const original = api[functionName];
  const replica = clone(original, context);
  const callData = [];
  const interceptor = function() {
    const currentIntelligence = {
      args: Array.from(arguments),
      return: replica(...arguments)
    };
    callData.push(currentIntelligence);
    return currentIntelligence.return;
  };
  api[functionName] = interceptor;
  const report = function() {
    api[functionName] = original;
    return callData;
  };
  return {
    report
  };
};

export { createSpion as default };
//# sourceMappingURL=createSpion.js.map
