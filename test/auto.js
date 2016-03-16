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
      getData: Promise.resolve(1),
      makeFolder: Promise.resolve(1)
    }

    async.auto(tasks).then(res => {
      console.log(res)
    });
  });

});
