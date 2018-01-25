
/*
* Unit tests for s-inherit
*/
var inherit = module.exports = require('../s-inherit.min.js');
// require('chai').should();
var expect = require('chai').expect;
var assert = require('chai').assert;
// NOTE using "equal" to more understandable what happening
// test class 1
Constructor1._setSuper = function ( Parent ) { this.super1 = Parent; }
Constructor1.prototype.foo = function ( str ) { return (str||'')+'Constructor1 foo';}
function Constructor1 () {
    if ( typeof this.super1 == 'function' ) {
        this.super1.call(this);
    }
    this.name = 'Constructor1';
}
// test class 2
Constructor2._setSuper = function ( Parent ) { this.super2 = Parent; }
Constructor2.prototype.foo = function ( str ) { return (str||'')+'Constructor2 foo';}
function Constructor2 () {
    if ( typeof this.super2 == 'function' ) {
        this.super2.call(this);
    }
    this.name = 'Constructor2';
}
// test class 3
Constructor3._setSuper = function ( Parent ) { this.super3 = Parent; }
Constructor3.prototype.foo = function ( str ) { return (str||'')+'Constructor3 foo';}
function Constructor3 () {
    if ( typeof this.super3 == 'function' ) {
        this.super3.call(this);
    }
    this.name = 'Constructor3';
}
// test class 4
Constructor4._setSuper = function ( Parent ) { this.super4 = Parent; }
Constructor4.prototype.foo = function ( str ) { return (str||'')+'Constructor4 foo';}
function Constructor4 () {
    if ( typeof this.super4 == 'function' ) {
        this.super4.call(this);
    }
    this.name = 'Constructor4';
}

describe('INHERIT', function() {

    it('should exist', function() {
        expect(inherit).to.be.a('function');
    });

    it('should has methods', function() {
        expect(inherit.extend).to.be.a('function');
        expect(inherit.decorate).to.be.a('function');
        expect(inherit._related).to.be.a('function');
    });

    it('method "_related" Constructor test', function() {
        var Constructor12 = inherit._related(Constructor1, Constructor2);
        expect(Constructor12, 'shold return Constructor').to.be.a('function');
    });

    it('method "_related" instance test', function() {
        var instance12 = new ( inherit._related(Constructor1, Constructor2) );
        expect(instance12, 'instance').to.be.a('object');
        expect(instance12.name, 'instance props').to.equal('Constructor1');
        expect(instance12.foo(), 'instance methods').to.equal('Constructor1 foo');
        expect(instance12.super1.prototype, 'instance prototype').to.equal(Constructor2.prototype);
    });

    it('method "_related" no break origin classes', function() {
        var instance21 = new ( inherit._related(Constructor2, Constructor1) );
        expect(instance21, 'instance').to.be.a('object');
        expect(instance21.name, 'instance props').to.equal('Constructor2');
        expect(instance21.foo(), 'instance methods').to.equal('Constructor2 foo');
        expect(instance21.super2.prototype, 'instance prototype').to.equal(Constructor1.prototype);
    });

    it('method "extend" Constructor test', function() {
        var Constructor1234 = inherit.extend(Constructor1, Constructor2, Constructor3, Constructor4);
        expect(Constructor1234, 'shold return Constructor').to.be.a('function');
    });

    it('method "extend" instance test', function() {
        var instance1234 = new ( inherit.extend(Constructor1, Constructor2, Constructor3, Constructor4) );
        expect(instance1234, 'instance').to.be.a('object');
        expect(instance1234.name, 'instance props').to.equal('Constructor1');
        expect(instance1234.foo(), 'instance methods').to.equal('Constructor1 foo');
        expect(instance1234.super1.prototype.super2.prototype.super3.prototype, 'instance prototype').to.equal(Constructor4.prototype);
    });

    it('method "extend" no break origin classes', function() {
        var instance4321 = new ( inherit.extend(Constructor4, Constructor3, Constructor2, Constructor1) );
        expect(instance4321, 'instance').to.be.a('object');
        expect(instance4321.name, 'instance props').to.equal('Constructor4');
        expect(instance4321.foo(), 'instance methods').to.equal('Constructor4 foo');
        expect(instance4321.super4.prototype.super3.prototype.super2.prototype, 'instance prototype').to.equal(Constructor1.prototype);
    });

    it('method "decorate" Constructor test', function() {
        var Decorated = inherit.decorate(Constructor1, {name: 'fail'}, Constructor2);
        expect(Decorated, 'shold return Constructor').to.be.a('function');
        expect(Decorated.prototype, 'instance prototype').to.equal(Constructor1.prototype);
    });

    it('method "decorate" priority', function() {
        var decoratedInstance = new ( inherit.decorate(Constructor1, {top: 100, left: 100}, {width: 100, heigh: 100, name: 'fail'}) );
        expect(decoratedInstance, 'instance').to.be.a('object');
        expect(decoratedInstance.name, 'name by priority').to.equal('Constructor1');
        expect(decoratedInstance.foo(), 'instance methods').to.equal('Constructor1 foo');
    });

});
