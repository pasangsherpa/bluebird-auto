'use strict';

const async = require('../lib');
const should = require('should');
const Promise = require('bluebird');

describe('bluebird-auto', function() {
  it('should return a promise', () => {
    const auto = async.auto();
    auto.should.be.a.Promise();
  });
});
