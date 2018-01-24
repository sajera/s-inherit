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
