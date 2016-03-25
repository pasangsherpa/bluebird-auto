'use strict';

const Promise = require('bluebird');

/**
 * Determines the best order for running functions based on their
 * requirements. Each function can optionally depend on other
 * functions being completed first, and each function is run as
 * soon as its requirements are satisfied.
 *
 * @param  {Object}   An object literal containing named functions.
 * @return {Promise}  A promise for the final version of the results.
 */
const auto = (tasks, concurrency) => {
  return new Promise((resolve, reject) => {
    const keys = Object.keys(tasks || {});
    const numTasks = keys.length;
    if (!numTasks) return resolve(null);

    const params = {};
    const dependencies = keys.reduce((result, key) => {
      const task = tasks[key];
      if (Array.isArray(task)) {
        result[key] = task.slice(0, task.length - 1);
        params[key] = 'results';
        tasks[key] = task.slice(-1)[0];
      } else {
        result[key] = [];
      }
      return result;
    }, {});

    // Object for final results
    const results = {};
    const resolved = {};

    // This will run until we got everything resolved
    const resolver = () => {
      const batch = [];
      const order = [];
      Object.keys(dependencies).forEach(opkey => {
        if (opkey in results) {
          return;
        }
        let value = tasks[opkey];
        // If value is a function ...
        if (typeof value === 'function') {
          // Check if dependencies are met ...
          const deps = dependencies[opkey];
          if (!deps.filter(d => !(d in results)).length) {
            // Then redefine as result of function call with injected args
            const args = params[opkey] === 'results' ? [results] : params[opkey].map(d => results[d]);
            // Note: value goes on to be checked for promise status further down
            value = value.apply(null, args);
          } else {
            // Dependencies are not fulfilled yet, wait for next batch
            return;
          }
        }

        // If value is a promise, add it to batch
        if (value && value.then && typeof value.then === 'function') {
          batch.push(value);
          order.push(opkey);
          return;
        }

        // Else, just add it to results
        results[opkey] = value;
      });

      if (!batch.length) {
        if (Object.keys(results).length !== Object.keys(tasks).length) {
          const unresolved = Object.keys(tasks).reduce((out, op) => {
            if (!results[op]) {
              out.push(op);
            }
            return out;
          }, []);

          throw new Error('Unresolvable dependencies: ' + unresolved.join(', '));
        }
        return results;
      }

      return Promise.all(batch).then(values => {
        values.forEach((value, i) => results[order[i]] = value);
      }).then(resolver);
    };

    // Kick off
    resolve(resolver());

  });
}

/**
 * Expose auto
 */

module.exports = auto;
