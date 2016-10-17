
console.log('test');
var inherit = require('./index.js');

/*-------------------------------------------------
	usually expects a dummy for shows model scheme
---------------------------------------------------*/
function Dummy () {
	console.log('Dummy', arguments);
	this.args = arguments;
	this.source = 'Dummy';
}
Dummy.prototype = {
	constructor: Dummy,
	instance: 'Dummy',
	t1: 1,
	t2: 2,
	t3: 3,
	t4: 4,
	t5: 5,
	test: function ( some ) {
		console.log('dummy', some);
	}
};

/*-------------------------------------------------
	after that, setting a base functionality (by type of model or something like that)
---------------------------------------------------*/
function Base1 () {
	console.log('Base1', arguments);
	this.args = arguments;
	this.source1 = 'Base1';
}
Base1.prototype = {
	constructor: Base1,
	instance: 'Base1',
	t1: 'Base1',
	test1: function ( some ) {
		this.test(' 1 '+ some);
	},
	test: function ( some ) {
		this.base1Super.prototype.test(' base1 '+ some);
	}
};
/*-------------------------------------------------
	WTF ???
		it's method to set super by unique name for this Class
---------------------------------------------------*/
Base1._setSuper = function ( Super ) {
	// you can call to super or super prototype by this unique name
	this.base1Super = this.base1Super||Super;
};

function Base2 () {
	console.log('Base2', arguments);
	this.args = arguments;
	this.source2 = 'Base2';
}
Base2.prototype = {
	constructor: Base2,
	instance: 'Base2',
	t2: 'Base2',
	test2: function ( some ) {
		this.test1(' 2 '+ some);
	},
	test: function ( some ) {
		this.base2Super.prototype.test(' base2 '+ some);
	}
};
Base2._setSuper = function ( Super ) {
	// you can call to super or super prototype by this unique name
	this.base2Super = this.base2Super||Super;
};
/*-------------------------------------------------
	after that, we want set a functionality the model for this implementation
---------------------------------------------------*/
function Foo3 () {
	console.log('Foo3', arguments);
	this.args = arguments;
	this.source3 = 'Foo3';
}
Foo3.prototype = {
	constructor: Foo3,
	instance: 'Foo3',
	t3: 'Foo3',
	test3: function ( some ) {
		this.test2(' 3 '+ some);
	},
	test: function ( some ) {
		this.foo3Super.prototype.test(' foo3 '+ some);
	}
};
Foo3._setSuper = function ( Super ) {
	// you can call to super or super prototype by this unique name
	this.foo3Super = this.foo3Super||Super;
};


function Foo4 () {
	console.log('Foo4', arguments);
	this.args = arguments;
	this.source4 = 'Foo4';
}
Foo4.prototype = {
	constructor: Foo4,
	instance: 'Foo4',
	t4: 'Foo4',
	test4: function ( some ) {
		this.test3(' 4 '+ some);
	},
	test: function ( some ) {
		this.foo4Super.prototype.test(' foo4 '+ some);
	}
};
Foo4._setSuper = function ( Super ) {
	// you can call to super or super prototype by this unique name
	this.foo4Super = this.foo4Super||Super;
};

/*-------------------------------------------------
	after that, we want a decorate the model for this implementation
---------------------------------------------------*/
function Decor5 () {
	console.log('Decor5', arguments);
	this.args = arguments;
	this.source5 = 'Decor5';
}

function Decor6 () {
	console.log('Decor6', arguments);
	this.args = arguments;
	this.source6 = 'Decor6';
}

// without broken origin classes
var NewClass = inherit.extend(Dummy, Base1, Base2, Foo3, Foo4, Decor5, Decor6);
window.instance = new NewClass('best');



if ( typeof window != 'undefined' ) {
	window.inherit = inherit;
}