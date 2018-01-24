/*
 * s-inherit version 1.0.3 at 2018-01-24
 * @license MIT License Copyright (c) 2016 Serhii Perekhrest <allsajera@gmail.com> ( Sajera )    
 */
/** @ignore */
(function () {'use strict';

// polifill
var setPrototypeOfPolifill = (function ( native ) {
    if ( typeof native == 'function' ) return native.bind(Object);
    // slower than the native. MDN => https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Object/setPrototypeOf
    else return function ( obj, proto ) {
        obj.__proto__ = proto;
        return obj;
    }
})( Object.setPrototypeOf );

/**
 * @description
    origin inherit from node util
    BUT super called like "super"
 * @example
    var inherit = require('s-inherit');
    var DecoratedClass = inherit(Class, Parent);
 * @param { Function } ctor - constructor to extend
 * @param { Function } superCtor - constructor which will be installed as "super"
 * @returns { Function } - constructor
 * @function inherit
 * @public
 */
function inherit ( ctor, superCtor ) {
    if (ctor === undefined || ctor === null)
        throw new TypeError('The constructor to "inherits" must not be null or undefined');

    if (superCtor === undefined || superCtor === null)
        throw new TypeError('The super constructor to "inherits" must not be null or undefined');

    if (superCtor.prototype === undefined)
        throw new TypeError('The super constructor to "inherits" must have a prototype');

    Object.defineProperty(ctor, 'super', {
        value: superCtor,
        writable: false,
        enumerable: false,
        configurable: false
    });

    setPrototypeOfPolifill(ctor.prototype, superCtor.prototype);
}


 /**
  * @description
    Make new Constructor with nested construction of a chain of prototypes
    hard relation of child constructor to parent constructor.
    The "super" defined from static method "_setSuper".
    If it absent Constructor lose ability call to Parent context.
  * @example
     var inherit = require('s-inherit');
     //
     function Parent () { ... }
     //
     function Child ( data ) {
        // Adding personal owned properties to the parent
        this.superUniqueProperty.call(this, data);
        // own properties of the constructor and/or overrides
        this.props = 1;
    }
    Child._setSuper = function ( Parent ) {
        this.superUniqueProperty = Parent;
    }
    // Constructor with nested construction of a chain of prototypes
    var Inheritor = inherit._related(Parent, Child);
  * @param { Function } Parent - constructor which will be installed as "super"
  * @param { Function } Child - constructor to extend
  * @returns { Function } - constructor
  * @function inherit._related
  * @public
  */
inherit['_related'] = makeClass;
function makeClass ( Parent, Child ) {
    function Super ( base ) { Object.assign(this, base); };
    function Class () {
        Parent.apply(this, Array.prototype.slice.call(arguments, 0));
        Child.apply(this, Array.prototype.slice.call(arguments, 0));
    };
    Super.prototype = Parent.prototype;
    Class.prototype = new Super( Child.prototype );
    // if defined method of setting a super - use it
    if ( typeof Child._setSuper == 'function' ) {
        Child._setSuper.call(Class.prototype, Parent );
    }
    return Class.prototype.constructor = Class;
}

/**
 * @description
   Make new Constructor with nested construction of a chain of prototypes
   hard relation of child constructor to parent constructor.
   The "super" defined from static method "_setSuper".
   If it absent Constructor lose ability call to Parent context.
   No limit for nested construction of a chain of prototypes.
 * @example
    var inherit = require('s-inherit');
    // it will give ability to combine inheritance any to any
    function Parent1 () { ... }
    Parent1._setSuper = function ( Parent ) { this.p1 = Parent; }
    function Parent2 () { ... }
    Parent2._setSuper = function ( Parent ) { this.p2 = Parent; }
    function Parent3 () { ... }
    Parent3._setSuper = function ( Parent ) { this.p3 = Parent; }
    function Parent4 () { ... }
    Parent4._setSuper = function ( Parent ) { this.p4 = Parent; }
    //
    function Child ( data ) {
       // Adding personal owned properties to the parent
       this.superUniqueProperty.call(this, data);
       // own properties of the constructor and/or overrides
       this.props = 1;
   }
   Child._setSuper = function ( Parent ) {
       this.superUniqueProperty = Parent;
   }
   // Constructor with nested construction of a chain of prototypes
   var Inheritor = inherit.extend(Child, Parent1, Parent2, Parent3, Parent4);
 * @param { Function } Ctor - constructor to extend
 * @param ...
 * @returns { Function } - constructor
 * @function inherit.extend
 * @public
 */
inherit['extend'] = classExtend;
function classExtend ( Result ) {
    if ( typeof Result == 'function' ) {
        for ( var key = 1; key < arguments.length; key ++ ) {
            if ( typeof arguments[key] == 'function' ) {
                Result = makeClass(Result, arguments[key]);
            } else { throw new TypeError('The constructor to "inherit" must be a function'); }
        }
        return Result;
    } else throw new TypeError('The constructor to "inherit" must be a function');
}

/**
 * @description
    Make a new class using every transferred class and/or Object as decorator.
 * @example
    var inherit = require('s-inherit');
    var DecoratedClass = inherit.decorate(Class, Parent, Grandpa, {pa_of: 'grandpa'});
 * @param { Function||Object } - Any count classes first is a base and alse like a decorate for prototype
 * @param ...
 * @returns { Function } - Class child with child prototype wich inherit all parents
 * @function inherit.decorate
 * @public
 */
inherit['decorate'] = decorateClass;
function decorateClass () {
    var args = arguments;
    function Class () {
        for ( var key = 0; key < args.length; key ++ )
            if ( typeof args[key] == 'function' ) args[key].apply(this, Array.prototype.slice.call(arguments, 0));
            else if ( typeof args[key] == 'object' ) Object.assign(this, args[key]);
    }
    Class.prototype = args[0].prototype;
    return Class;
}

/**
 * @description
    defination on platforms (both variants on platform like Electron)

    bower i --save s-inherit

    npm i --save s-inherit

 * @example window.inherit                      // in browser
 * @example var inherit = require('s-inherit')  // in Node.js
 *
 * @exports s-inherit
 * @public
 */
if ( typeof process != 'undefined' && Object.prototype.toString.call(process) == '[object process]' ) {
    module.exports = inherit;
}
if ( typeof window != 'undefined' && Object.prototype.toString.call(window) == '[object Window]' ) {
    window['inherit'] = inherit;
}

})() 