'use strict';

const Promise = require('bluebird');

/**
 * Expose auto
 */

module.exports = auto;

/**
 * Determines the best order for running functions based on their 
 * requirements. Each function can optionally depend on other 
 * functions being completed first, and each function is run as 
 * soon as its requirements are satisfied. 
 * 
 * @param  {Object}   An object literal containing named functions.
 * @return {Promise}  A promise for the final version of the results.
 */
const auto = tasks => {
  return new Promise((resolve, reject) => {

  });
}