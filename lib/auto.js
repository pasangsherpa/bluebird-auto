'use strict';

const R = require('ramda');
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
    const keys = R.keys(tasks);
    const numTasks = keys.length;
    if (!numTasks) return cb(null);

    // default concurrency value to num of tasks
    concurrency = concurrency || numTasks;

    let runningTasks = 0;
    let hasError = false;
    let results = {};
    let listeners = {};
    let readyTasks = [];


    // queue tasks and their deps
    const queueTasks = (task, key) => {
      if (!R.isArrayLike(task)) {
        // no dependencies
        return enqueueTask(key, [task]);
      }

      // remove the last as it's the actual function
      let dependencies = task.slice(0, task.length - 1);
      let remainingDependencies = dependencies.length;


      // check for deadlock


      // queue dependency task
      // const queueDeps = dep => {
      //   addListener(dep, () => {
      //     remainingDependencies--;
      //     if (remainingDependencies === 0) {
      //       enqueueTask(key, task);
      //     }
      //   });
      // }

      // queue all deps
      // R.forEach(queueDeps, dependencies);
    }

    // extract all tasks and queue them
    R.mapObjIndexed(queueTasks, tasks);


    function enqueueTask(key, task) {
      readyTasks.push(() => {
        runTask(key, task);
      });
    }

    (function processQueue() {
      if (readyTasks.length === 0 && runningTasks === 0) {
        return resolve(results);
      }
      while (readyTasks.length && runningTasks < concurrency) {
        const run = readyTasks.shift();
        run();
      }
    })();

    function addListener(taskName, fn) {
      let taskListeners = listeners[taskName];
      if (!taskListeners) {
        taskListeners = listeners[taskName] = [];
      }

      taskListeners.push(fn);
    }

    function taskComplete(taskName) {
      const taskListeners = listeners[taskName] || [];
      R.forEach(fn, taskListeners);
      processQueue();
    }

    function runTask(key, task) {

    }
  });
}

/**
 * Expose auto
 */

module.exports = auto;
