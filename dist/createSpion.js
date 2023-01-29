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
      const callData = [];
      const tracker = function() {
        const currentIntelligence = {
          args: Array.from(arguments),
          return: replica(...arguments)
        };
        callData.push(currentIntelligence);
        return currentIntelligence.return;
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

    return createSpion;

}));
//# sourceMappingURL=createSpion.js.map
