'use strict';

const async = require('../lib');
const should = require('should');
const Promise = require('bluebird');

describe('bluebird-auto', function() {
  it('should return a promise', () => {
    const auto = async.auto();
    auto.should.be.a.Promise();
  });

  it('basics', function(done) {
    const callOrder = [];
    const tasks = {
      task1: ['task2', results => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            callOrder.push('task1');
            resolve(1);
          }, 25);
        });
      }],
      task2: new Promise((resolve, reject) => {
        setTimeout(() => {
          callOrder.push('task2');
          resolve(2);
        }, 50);
      }),
      task3: ['task2', results => {
        return new Promise((resolve, reject) => {
          callOrder.push('task3');
          resolve(3);
        });
      }],
      task4: ['task1', 'task2', results => {
        return new Promise((resolve, reject) => {
          callOrder.push('task4');
          resolve(4);
        });
      }],
      task5: ['task2', results => {
        return new Promise((resolve, reject) => {
          setTimeout(function() {
            callOrder.push('task5');
            resolve(5);
          }, 0);
        });
      }],
      task6: ['task2', results => {
        return new Promise((resolve, reject) => {
          callOrder.push('task6');
          resolve(6);
        });
      }]
    }

    async.auto(tasks)
      .then(results => {
        const expected = ['task2', 'task3', 'task6', 'task5', 'task1', 'task4'];
        callOrder.should.deepEqual(expected);
        done();
      }).catch(err => {
        err.should.equal(null);
        done();
      });
  });


  it('auto results', function(done) {
    const callOrder = [];
    const tasks = {
      task1: ['task2', results => {
        results.task2.should.equal('task2');
        return new Promise((resolve, reject) => {
          setTimeout(function() {
            callOrder.push('task1');
            resolve(['task1a', 'task1b']);
          }, 25);
        });
      }],
      task2: new Promise((resolve, reject) => {
        setTimeout(function() {
          callOrder.push('task2');
          resolve('task2');
        }, 50);
      }),
      task3: ['task2', results => {
        results.task2.should.equal('task2');
        return new Promise((resolve, reject) => {
          callOrder.push('task3');
          resolve();
        });
      }],
      task4: ['task1', 'task2', results => {
        results.task1.should.deepEqual(['task1a', 'task1b']);
        results.task2.should.equal('task2');
        return new Promise((resolve, reject) => {
          callOrder.push('task4');
          resolve('task4');
        });
      }]
    }
    async.auto(tasks)
      .then(results => {
        const expectedOrder = ['task2', 'task3', 'task1', 'task4'];
        const expectedResult = { task1: ['task1a', 'task1b'], task2: 'task2', task3: undefined, task4: 'task4' };
        callOrder.should.deepEqual(expectedOrder);
        results.should.deepEqual(expectedResult);
        done();
      });
  });
});
