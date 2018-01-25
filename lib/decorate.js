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
