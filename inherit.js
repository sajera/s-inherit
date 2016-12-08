/**
 * s-inherit    
 * MIT License Copyright (c) 2016 Serhii Perekhrest <allsajera@gmail.com> ( Sajera )    
 */
(function () {'use strict';

// plifill
var setPrototypeOfPolifill = (function ( native ) {
    if ( typeof native == 'function' ) return native.bind(Object);
    // slower than the native. MDN => https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Object/setPrototypeOf
    else return function ( obj, proto ) {
        obj.__proto__ = proto;
        return obj;
    }
})( Object.setPrototypeOf );

/**
 * origin inherit from node util
 * BUT super called like "super"
 *
 * @param ctor: { Function }      - constructor to extend
 * @param superCtor: { Function } - constructor which be setted like "super"
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
 * create new Class with relations like Parent and Child
 *
 * @param Parent: { Function }
 * @param Child: { Function }
 * @returns: { Function }
 */
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
 * create a new class - wrapper wich check correct data type and recall a class maker for each arguments
 * 
 * @param ALL: { Function } - Any count classes first is a base and alse like a decorate for prototype
 * @returns: { Function } - Class child with child prototype wich inherit all parents
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
 * return new class and used each seted class like a decorator
 *
 * @param: { Function||Object } - Any count classes first is a base and alse like a decorate for prototype
 * @returns: { Function } - Class child with child prototype wich inherit all parents
 */
inherit['decorate'] = decorate;
function decorate () {
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
 * EXPORTS
 *
 * @public
 */
if ( typeof process != 'undefined' && Object.prototype.toString.call(process) == '[object process]' ) {
    module.exports = inherit;
}
if ( typeof window != 'undefined' && Object.prototype.toString.call(window) == '[object Window]' ) {
    window['inherit'] = inherit;
}

})() 