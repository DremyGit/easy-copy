# easy-copy

[![Build Status](https://travis-ci.org/DremyGit/easy-copy.png)](https://travis-ci.org/DremyGit/easy-copy)
[![Coverage Status](https://coveralls.io/repos/github/DremyGit/easy-copy/badge.svg?branch=master)](https://coveralls.io/github/DremyGit/easy-copy?branch=master)

Copy some properties of an object easily [中文文档](https://dremy.cn/blog/introduction-for-easy-copy)


### Install

#### By npm

```
$ npm install easy-copy
```
#### By bower

```
$ bower install easy-copy
```

### Usage

#### easyCopy(src [, filter [, opt]])

+ `src`: The source object, where all of the props comes from
+ `filter`: The filter condition, it could be a `String`, `Array`, or an `Object`, and they could be nested deeply
+ `opt`: The options for copy operation

### Get Start

If you often write some code like this:

```js
const data = {
    name: body.name,
    age: body.age,
    major: body.major,
    email: body.email
}
```

You must fell tired very much. How can we do if we use easy-copy?

```js
// Import easy-copy module
const easycopy = require('easy-copy');

const data = easycopy(body, ['name', 'age', 'major', 'email']);
// Yes! Just write an array :)
```

### Deeply copy

If an object is nested like this:

```js
const foo = {
  id: 1,
  children: [
    { id: 2, children: [] },
    {
      id: 3,
      children: [
        { id: 4, children: [] },
        { id: 5, children: [] }
      ]
    },
    { id: 6, children: [] }
  ]
}
```

We can process this object easily using easy-copy. For example, if we just want to
keep the second property of the children property, we can do like this:

```js
const bar = easycopy(foo, {children: 1})

console.log(bar);
// {
//   children: [
//     {
//       id: 3,
//       children: [
//         { id: 4: children: [] },
//         { id: 5: children: [] }
//       ]
//     }
//   ]
// }
```

OK, but if I want copy the 2 properties which id is 4 and 5, how can I do? You can write like this:

```js
const baz = easycopy(foo, {children: [{1: {children: 0}}, 2]});

console.log(baz);
// {
//   children: [
//     {
//       children: [
//         { id: 4, children: [] }
//       ]
//     },
//     { id: 6, children: [] }
//   ]
// }
```

Yeah! It's so easy!


### Options

The third argument of `easycopy()` is options. At present, the `v1.0` version is support only one option: `undefined`.
it could transform the non existed prop of src object set to `undefined` automatically. The default value is `true`,
in other words, it relay on the filter argument to set the target properties.

Here are some example:


```js
const foo = {
  a: 1,
  b: 2,
  c: {
    d: 1,
    e: 2
  }
}

const bar = easycopy(foo, [{c: ['d', 'z']}, {f: 'h'}]);
// {
//   c: {
//     d: 1,
//     z: undefined
//   },
//   f: {
//     h: unfined
//   }
// }

const baz = easycopy(foo, [{c: ['d', 'z']}, {f: 'h'}], {undefined: false});
// {
//   c: {
//     d: 1,
//   },
// }
```


So you can decide how to filter and copy an object by your self, and you will not meet with some error
like `Cannot read property 'xxx' of undefined`, it is so nasty, isn't it?

## Licence

[MIT](https://github.com/DremyGit/easy-copy/blob/master/LICENSE)

