
'use strict';

(function (glob) {
	/**
	 * clasical node inherits
	 * super called like "super"
	 */
	function nodeInherits ( ctor, superCtor ) {

		if (ctor === undefined || ctor === null)
			throw new TypeError('The constructor to "inherits" must not be null or undefined');

		if (superCtor === undefined || superCtor === null)
			throw new TypeError('The super constructor to "inherits" must not be null or undefined');

		if (superCtor.prototype === undefined)
			throw new TypeError('The super constructor to "inherits" must have a prototype');


		// ctor.super_ = superCtor;
		Object.defineProperty(ctor, 'super', {
			value: superCtor,
			writable: false,
			enumerable: false,
			configurable: false
		});
		setPrototypeOfPolifill(ctor.prototype, superCtor.prototype);
	};
	// plifill
	var setPrototypeOfPolifill = (function ( native ) {
		if ( typeof native == 'function' ) return native.bind(Object);
		// slower MDN => https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Object/setPrototypeOf
		else return function ( obj, proto ) {
			obj.__proto__ = proto;
			return obj;
		}
	})( Object.setPrototypeOf );

	/**
	 * create a new class
	 *
	 * @param: { Function } - take parent like Dummy
	 * @param: { Function } - Class
	 * @returns: { Function } - Class child with child prototype wich inherit a parent prototype
	 */
	// Object.assign.apply(Object,[this].concat(Array.prototype.slice.call(arguments, 0)));
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
		// Object.defineProperty(Class, 'super_', {
		// 	value: Parent,
		// 	writeble: false,
		// 	enumerable: false,
		// 	configurable: false
		// });
		return Class.prototype.constructor = Class;
	}

	/**
	 * create a new class - wrapper wich check correct data type and recall a class maker for each arguments
	 * without super
	 * @param: { Function } - Any count classes first is a base and alse like a decorate for prototype
	 * @returns: { Function } - Class child with child prototype wich inherit all parents
	 */
	nodeInherits.extend = classExtend;
	function classExtend ( Result ) {
		if ( typeof Result == 'function' ) {
			for ( var key = 1; key < arguments.length; key ++ ) {
				if ( typeof arguments[key] == 'function' ) {
					Result = makeClass(Result, arguments[key]);
				} else { throw new TypeError('The constructor to "inherit" must be a function'); }
			}
			return Result;
		} else throw new TypeError('The constructor to "inherit" must not be a function');
	}

	/**
	 * create a new class - wrapper wich check correct data type and recall a class maker for each arguments
	 * every constructor
	 * @param: { Function } - Any count classes first is a base and alse like a decorate for prototype
	 * @returns: { Function } - Class child with child prototype wich inherit all parents
	 */
	nodeInherits.extendsMulty = function ( Result ) {

	}


	/**
	 * return new class and used each seted class like a decorator
	 *
	 * @param: { Function } - Any count classes first is a base and alse like a decorate for prototype
	 * @returns: { Function } - Class child with child prototype wich inherit all parents
	 */
	nodeInherits.decorate = decorate;
	function decorate () {
		Class.prototype = arguments[0].prototype;
		var args = arguments;
		function Class () {
			for ( var key = 0; key < args.length; key ++ )
				if ( typeof args[key] == 'function' ) args[key].apply(this, Array.prototype.slice.call(arguments, 0));
				else if ( typeof args[key] == 'object' ) Object.assign(this, args[key]);
		}
		return Class;
	}
	/**
	 * return new class and used each seted class like a decorator
	 *
	 * @param: { Function } - Any count classes first is a base and alse like a decorate for prototype
	 * @returns: { Function } - Class child with child prototype wich inherit all parents
	 */
	function extendProto ( Class, proto ) {
		function Super ( base ) { Object.assign(this, base); };
		Super.prototype = proto;
		Super.prototype.getSuper = function () {

		}
		// var Class = decorate();
		// // its bad with many inherit
		// Object.defineProperty(Class, 'super', {
		// 	value: Parent,
		// 	writable: false,
		// 	enumerable: false,
		// 	configurable: false
		// });
		// Super.prototype = Parent.prototype;
		// Class.prototype = new Super( Child.prototype );
		// return Class.prototype.constructor = Class;

	}

	/**
	 * EXPORTS
	 *
	 * @public
	 */
	if ( typeof module == 'object' && typeof module.exports == 'object' ) {
		module.exports = nodeInherits;
	} else {
		glob.inherit = nodeInherits;
	}

})(this);