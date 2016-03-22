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
  const keys = Object.keys(tasks);
  const numTasks = keys.length;
  if (!numTasks) return Promise.resolve(null);

  const params = {};
  const dependencies = keys.reduce((result, key) => {
    const task = tasks[key];
    if (Array.isArray(task)) {
      result[key] = task.slice(0, task.length - 1);
      tasks[key] = task.slice(-1)[0];
    } else {
      result[key] = [];
    }
    return result;
  }, {});

  console.log(tasks)
  console.log(dependencies);
}

/*
  Helper function to parse out argument names, adapted from
  https://github.com/angular/angular.js/blob/43f72066e107445204aee074d7b4f184e9c05d9e/src/auto/injector.js
*/
const ARROW_ARG = /^([^\(]+?)=>/;
const FN_ARGS = /^[^\(]*\(\s*([^\)]*)\)/m;
// const FN_ARG_SPLIT = /,/;
// const FN_ARG = /^\s*(_?)(\S+?)\1\s*$/;
const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;

function extractArgs(fn) {
  const fnText = fn.toString().replace(STRIP_COMMENTS, ''),
    args = fnText.match(ARROW_ARG) || fnText.match(FN_ARGS);
  return args[1].replace(/[\s]*/g, '').split(/,/).filter(item => !!item);
}

/**
 * Expose auto
 */

module.exports = auto;
