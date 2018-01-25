
[![NPM version][npm-image]][npm-url]
[![License][license-image]][license-url]

s-inherit
===============

### installation for ```Node.js```

```shell
npm i s-inherit --save
```

### installation for ```Browser```

```shell
bower i s-inherit --save
```

**An easy way to make inheritance constructors for "ES5".**

Inherit
--------------

Node util "inherits" gives the mode of inheritance. 

```JavaScript
var inherit = require('s-inherit');
// rewrite constructor
inherit(Child, Parent); // the same as util.inherits
// make a instance
var instance = new Child();
```

Make constructor from others
--------------

When constructor inheritance, constructor which inherit got a link to super and broken for origin.Thoughts on the re-use base constructor led to the idea - to create a new constructor that inherits but does not overwrite the other (basic / decorating). This results in the creation of necessary construtors on the basis of any previously created and does not prevent their reuse further.


**Example:**

```javascript
var inherit = require('s-inherit');
// without broken origin constructor
var NewConstructor = inherit.extend(Child, Parent1, Parent2, Parent3);
```
>**Note:** without changing "Child".  (NewConstructor != Child)



#### usually expects a interface for future class.

```javascript
function Interface1 () {
    ...
}
Interface1.prototype = {
    ...
};
// different interfaces
function Interface2 () {
    ...
}
Interface2.prototype = {
    ...
};
```

#### after that, setting a base functionality.

```javascript
function Base1 () {
    ...
}
Base1.prototype = {
    ...
};
// different functionality
function Base2 () {
    ...
}
Base2.prototype = {
    ...
};
```


#### after that, we want set a realization.

```javascript
function Foo1 () {
    ...
}
Foo1.prototype = {
    ...
};
// different realizations
function Foo2 () {
    ...
}
Foo2.prototype = {
    ...
};
```

Example usage compilation for constructors
--------------

```javascript
var inherit = require('s-inherit');
// create constructor without broken origin constructor and prototypes
var Model1 = inherit.extend(Foo1, Base1, Interface1);
var Model2 = inherit.extend(Foo2, Base2, Interface2);
// or maybe Some thing more complicated
// in most cases it really hard to merge
var Model3 = inherit.extend(Model1, Base2, Interface2);
```
>**Note:** But if each of Constructor do not have relation based on inherent and still have the original version. It can be not so hard.


Decorate
--------------

Sometimes you need to make a decoration of the model, adding methods and fields for a particular implementation without affecting its inheritance, and without breaking the original class. How can it be.


**Example:**

```javascript
var inherit = require('s-inherit');
// make new class decorated for existing class of existing decorator and addition source
var Decorated = inherit.decorate(Foo1, {top: 100}, {top: 10, left: 100});
var instance = new Decorated( 'test' );
instance.top; // => 100 if it not overided from "Foo" constructor
```
>**Note:** scenery method ignores the prototypes of the classes.



Super
--------------

**say -** "We wanna get a SUPER - and that super must be a unique for each model which we defined"

This is a difficult moment. But I have a proposal for its decision. Since multiple inheritance, the main problem for a unique index transmission, within a single prototype class parent.

**ans -** "I offer to attend to yourself about how to point out the Super"

Extension expects a special method called "_setSuper" and correctly sends the super of model.


**Example:**

```javascript
function Foo4 () {
    console.log('Foo4', arguments);
    this.source4 = 'Foo4';
}

Foo4.prototype = {
    constructor: Foo4,
    instance: 'Foo4',
    t4: 'Foo4',
    test: function ( some ) {
        this[Super].prototype.test(' foo4 '+ some);
    }
};

/*-------------------------------------------------
    WTF ???
        it's method to set super by unique name for this Class
        I think this is a good solution for es6
        Since the syntax of classes implementing in ES6 more limits the javascript classes, than expanding their.
---------------------------------------------------*/
var Super = Symbol();
Foo4._setSuper = function ( Parent ) {
    // you can call to super or super prototype by this unique name
    this[Super] = this[Super]||Parent;
};
```

#### [```API documentation ```](https://github.com/sajera/s-inherit/blob/master/doc/API.md)

[npm-image]: https://badge.fury.io/js/s-inherit.svg
[npm-url]: https://npmjs.org/package/s-inherit
[license-image]: http://img.shields.io/npm/l/s-inherit.svg
[license-url]: LICENSE
