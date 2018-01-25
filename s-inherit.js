/*
 * s-inherit version 1.1.0 at 2018-01-25
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
    If it absent Constructor lose ability call to Parent.
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
    var Inheritor = inherit._related(Child, Parent);
 * @param { Function } Child - constructor to extend
 * @param { Function } Parent - constructor which will be installed as "super"
 * @returns { Function } - constructor
 * @function inherit._related
 * @public
 */
inherit['_related'] = makeClass;
function makeClass ( Child, Parent ) {
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
 * @param { Function } Child - constructor to extend
 * @param { Function } Parent - constructor which will be installed as "super"
 * @param { Function } [Parent] - constructor which will be installed as "super" as many times as you need
 * @returns { Function } - constructor
 * @function inherit.extend
 * @public
 */
inherit['extend'] = classExtend;
function classExtend () {
    var i = arguments.length, Result = arguments[i-1], Parent, Child;
    // for ( var key = arguments.length-1; key; key -- ) {
    //     if ( typeof arguments[key] == 'function' ) {
    //         Result = makeClass(Result, arguments[key]);
    //     } else { throw new TypeError('The constructor to "inherit" must be a function'); }
    // }
    do {
        i--;
        Parent = Result;
        Child = arguments[i-1];
        if ( typeof Child == 'function' && typeof Parent == 'function' ) {
            Result = makeClass(Child, Parent);
        } else { throw new TypeError('The constructor to "inherit" must be a function'); }

        console.log(i);
    } while ( i > 1 )
    return Result;
}

/**
 * @description
    Make a new constructor using every transferred class and/or Object as decorator.
    Constructor steel have it own prototype, but have all own props from all decorators.
    Can be used as binded Constructor properties.
 * @example
    var inherit = require('s-inherit');
    var DecoratedClass = inherit.decorate(Cube, {top: 100, left: 100}, {width: 100, heigh: 100, long: 100});
 * @param { Function||Object } source - constructor to extend
 * @param { Function||Object } decorator - Expand the personally owned property
 * @returns { Function } - constructor
 * @function inherit.decorate
 * @public
 */
inherit['decorate'] = decorateClass;
function decorateClass () {
    var args = arguments;
    function Class () {
        for ( var key = args.length-1; key >= 0; key -- )
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