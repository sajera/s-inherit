
[![NPM version][npm-image]][npm-url]

s-inherit
===============

An easy way to make inheritance classes

### installation
```shell
npm i s-inherit --save
```

Inherit
--------------

Node util "inherits" gives the mode of inheritance. 

```javascript
function Dummy () { this.source = 'Dummy'; }
Dummy.prototype = {
    constructor: Dummy,
    test: function ( some ) {
        console.log(' dummy '+this.source, some);
    }
};
function Base () {
    this.constructor.super.call(this);
    this.source1 = 'Base'
}
Base.prototype = {
    constructor: Base,
    test: function ( some ) { // yes rewrite to "super" (not "_super" or "super_") 
        this.constructor.super.prototype.test(' base '+this.source1+ some);
    }
};

var inherit = require('s-inherit');
// rewrite class
inherit(Base, Dummy);
// make a instance
var instance = new Base();
// use method which used parent method
instance.test('test');
```


    
Make class from others
--------------

When classes inheritance, class which inherit got a link to super and broken for origin.Thoughts on the re-use base classes led to the idea - to create a new class that inherits but does not overwrite the other (basic / decorating). This results in the creation of necessary classes on the basis of any previously created and does not prevent their reuse further.


Example 
--------------

```javascript
var inherit = require('s-inherit');

// without broken origin classes
var NewClassFromAll = inherit.extend(Dummy, Base1, Base2, Foo3, Foo4, Decor5, Decor6);

```

usually expects a dummy for class
```javascript
function Dummy () {
    console.log('Dummy', arguments);
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
```

after that, setting a base functionality (by type of model or something like that)

```javascript
function Base1 () {
    console.log('Base1', arguments);
    this.source1 = 'Base1';
}
Base1.prototype = {
    constructor: Base1,
    instance: 'Base1',
    t1: 'Base1',
    test1: function ( some ) {
        this.test(' 1 '+ some);
    },
};

function Base2 () {
    console.log('Base2', arguments);
    this.source2 = 'Base2';
}
Base2.prototype = {
    constructor: Base2,
    instance: 'Base2',
    t2: 'Base2',
    test2: function ( some ) {
        this.test1(' 2 '+ some);
    },
};
```


after that, we want set a functionality the model for this implementation

```javascript
function Foo3 () {
    console.log('Foo3', arguments);
    this.source3 = 'Foo3';
}
Foo3.prototype = {
    constructor: Foo3,
    instance: 'Foo3',
    t3: 'Foo3',
    test3: function ( some ) {
        this.test2(' 3 '+ some);
    },
};

function Foo4 () {
    console.log('Foo4', arguments);
    this.source4 = 'Foo4';
}
Foo4.prototype = {
    constructor: Foo4,
    instance: 'Foo4',
    t4: 'Foo4',
    test4: function ( some ) {
        this.test3(' 4 '+ some);
    },
};
```

after that, we want a decorate the model for this implementation

```javascript
function Decor5 () {
    console.log('Decor5', arguments);
    this.source5 = 'Decor5';
}

function Decor6 () {
    console.log('Decor6', arguments);
    this.source6 = 'Decor6';
}
```

Example usage compilation of class
--------------

```javascript
var inherit = require('s-inherit');
// create class without broken origin classes
var NewClassFromAll = inherit.extend(Dummy, Base1, Base2, Foo3, Foo4, Decor5, Decor6);
// instance
var instanceAll = new NewClassFromAll();
// there is no need to drag all
var NewClassFromBase = inherit.extend(Dummy, Base1, Foo2, Decor5);
// use only necessary functionality
var NewClassLightBase = inherit.extend(Dummy, Base2, Foo3, Decor6);

```

Super
--------------

>**say -** "We wanna get a SUPER - and that super must be a unique for each model which we defined"

This is a difficult moment. But I have a proposal for its decision. Since multiple inheritance, the main problem for a unique index transmission, within a single prototype class parent.

**ans -** "I offer to attend to yourself about how to point out the Super"

Extension expects a special method called "_setSuper" and correctly sends back the super of model.


**Example:**

```javascript
function Foo4 () {
    console.log('Foo4', arguments);
    this.source4 = 'Foo4';
}
/*-------------------------------------------------
    WTF ???
        it's method to set super by unique name for this Class
---------------------------------------------------*/
Foo4._setSuper = function ( Super ) {
    // you can call to super or super prototype by this unique name
    this.foo4Super = this.foo4Super||Super;
};

Foo4.prototype = {
    constructor: Foo4,
    instance: 'Foo4',
    t4: 'Foo4',
    test: function ( some ) {
        this.foo4Super.prototype.test(' foo4 '+ some);
    }
};
```


[npm-image]: https://badge.fury.io/js/s-inherit.svg
[npm-url]: https://npmjs.org/package/s-inherit