
/*
* Unit tests for s-inherit
*/
var inherit = module.exports = require('../s-inherit.min.js');
// require('chai').should();
var expect = require('chai').expect;
var assert = require('chai').assert;

// beforeEach(function() {
//     console.log('"is", test beforeEach');
// });

// afterEach(function() {
//     console.log('"is", test afterEach');
// });

describe('INHERIT', function() {

    it('should exist', function() {
        expect(inherit).to.be.a('function');
    });

    it('should has methods', function() {
        expect(inherit.extend).to.be.a('function');
        expect(inherit.decorate).to.be.a('function');
        expect(inherit._related).to.be.a('function');
    });

    it('method "_related" test', function() {
        inherit._related

    });

    it('method "extend" test', function() {
        inherit.decorate

    });

    it('method "decorate" test', function() {
        inherit.decorate

    });

});
