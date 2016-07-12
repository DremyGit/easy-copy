'use strict';

function copy(obj, posArr) {
  var target, objType = getType(obj);
  switch (objType) {
  case 'array':
    target = [];
    break;
  case 'object':
    target = {};
    break;
  default:
    //console.log(obj, objType);
    throw new TypeError('Object is not a object or array');
  }

  for (var i = 0; i < posArr.length; i++) {
    var item = posArr[i];
    var key, value, childPos;
    if (getType(item) === 'object') {
      key = getFirstKey(item);
      childPos = item[key];
      if (getType(childPos) !== 'array') {
        childPos = [childPos];
      }
      value = copy(obj[key], childPos);
    } else {
      key = item;
      value = obj[key];
    }
    switch (objType) {
    case 'array':
      target.push(clone(value));
      break;
    case 'object':
      target[key] = clone(value);
      break;
    }
  }
  return target;
}

function getType(obj) {
  var type = typeof obj;
  if (type === 'object') {
    switch (Object.prototype.toString.call(obj)) {
    case '[object Object]':
      return 'object';
    case '[object Array]':
      return 'array';
    }
  } else {
    return type;
  }
}
function getFirstKey(obj) {
  if (typeof obj !== 'object') {
    throw new TypeError('Not an object');
  }
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      return key;
    }
  }
}
function clone(obj) {
  if (typeof obj === 'object') {
    var target = getType(obj) === 'array' ? [] : {};
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        target[prop] = clone(obj[prop]);
      }
    }
    return target;
  } else {
    return obj;
  }
}
module.exports = copy;
