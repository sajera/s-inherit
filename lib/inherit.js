
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
