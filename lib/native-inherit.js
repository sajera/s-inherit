
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
