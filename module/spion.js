const clone = function(original, context) {
  const bound = original.bind(context);
  const replica = Object.assign(bound, original);
  return replica;
};
const spion = function Spion2(api, functionName, context) {
  const original = api[functionName];
  const replica = clone(original, context);
  const callData = [];
  const tracker = function() {
    const currentCallInfo = {
      args: Array.from(arguments),
      return: replica(...arguments)
    };
    callData.push(currentCallInfo);
    return currentCallInfo.return;
  };
  api[functionName] = tracker;
  const report = function() {
    api[functionName] = original;
    return callData;
  };
  return {
    report
  };
};

export { spion as default };
//# sourceMappingURL=spion.js.map
