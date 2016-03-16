'use strict';

const async = require('../lib');
const should = require('should');
const Promise = require('bluebird');

describe('bluebird-auto', function() {

  it('should return a promise', () => {
    const auto = async.auto();
    auto.should.be.a.Promise();
  });

  it('should call tasks based on their requirements', function() {
    let callOrder = [];

    const tasks = {
      readData: Promise.resolve(1),
      showData: ['readData', results => {
      	// results.readData is the file's contents
      	// ...

      }]
    }

    async.auto(tasks).then(res => {
      console.log(res)
    });
  });

});
