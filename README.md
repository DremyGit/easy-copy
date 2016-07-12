# easy-copy

[![Build Status](https://travis-ci.org/DremyGit/easy-copy.png)](https://travis-ci.org/DremyGit/easy-copy)
[![Coverage Status](https://coveralls.io/repos/github/DremyGit/easy-copy/badge.svg?branch=master)](https://coveralls.io/github/DremyGit/easy-copy?branch=master)

Copy some properties of an object easily

## Getting started

### Install

#### By npm

```js
$ npm install easy-copy
```
#### By bower

```js
$ bower install easy-copy
```

### Usage

If you want to put some properties of an object to a new object

```js
var foo = {
  a: 1,     // need
  b: 2,     // no need
  c: {
    d: 4,   // need
    e: 5    // no need
  }
}
``` 
 
Maybe you will do like this:

```js
var bar = {
  a: foo.a,
  c: {
    d: foo.c.d
  }
}
```

It's too complicated! If we use `easy-copy`, it will be easily:

```js
var easycopy = require('easy-copy');
var bar = easycopy(foo, ['a', {c: 'd'}]);
```

The copy is deep copy, so it just like clone, but you can do some DIY:

```js
var bar = easycopy(foo)
// foo's deep copy object

var baz = easycopy(foo, ['a', 'c'])
// {
//  a: 1,
//  c: {
//    d: 4,
//    e: 5
//  }
//}
```

It also works in array, like this:

```js
var foo = [1, 2, 3, [4, 5, 6]];
var bar = easycopy(foo, [0, {3: 1}]);
// [1, [5]]
```

And you can mix object and array, like this:
```js
var foo = [{
  a: [1, 2, 3],
  b: [4]
}, {
  c: [
    5,
    {d: 6}
  ]
}];
var bar = easycopy(foo, [{0: 'a'}, {1: {c: 1}}]);
// [{
//   a: [1, 2, 3]
// }, {
//   c: [
//     {d: 6}
//   ]
// }];
```

Enjoy!

## Licence

[MIT](https://github.com/DremyGit/easy-copy/blob/master/LICENSE)

