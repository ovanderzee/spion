(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.createSpion = factory());
})(this, (function () { 'use strict';

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
      window.addEventListener(
        "interception",
        (event) => console.log(JSON.stringify(event.detail))
      );
      const interceptor = function() {
        const args = "withArgs" in callDirection ? callDirection.withArgs : arguments;
        const returnValue2 = replica(...args);
        const currentIntelligence = {
          args: Array.from(args),
          return: "returnValue" in callDirection ? callDirection.returnValue : returnValue2,
          time: performance.now() - start
        };
        const interception = new CustomEvent("interception", {
          detail: currentIntelligence
        });
        window.dispatchEvent(interception);
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

    return createSpion;

}));
//# sourceMappingURL=createSpion.js.map
