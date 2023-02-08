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
    const randomString = () => {
      const integer = Math.round(Math.random() * 1e10);
      return integer.toString(36);
    };

    const createSpion = function(api, functionName, context) {
      const original = api[functionName];
      const replica = clone(original, context);
      const callData = [];
      randomString();
      const interceptor = function() {
        const currentIntelligence = {
          args: Array.from(arguments),
          return: replica(...arguments)
        };
        callData.push(currentIntelligence);
        return currentIntelligence.return;
      };
      api[functionName] = interceptor;
      const debrief = function() {
        destroy();
        return report();
      };
      const destroy = function() {
        api[functionName] = original;
      };
      const report = function() {
        return callData;
      };
      return {
        debrief,
        destroy,
        report
      };
    };

    return createSpion;

}));
//# sourceMappingURL=createSpion.js.map
