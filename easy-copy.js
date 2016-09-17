'use strict';

(function () {
  var easycopy, copy
    , root = this;

  easycopy = copy = function (obj, posArr, opt) {

    if (typeof opt === 'undefined') {
      opt = {};
    }

    opt.undefined = typeof opt.undefined === 'undefined' ? true : opt.undefined;

    obj = obj || {};
    if (typeof posArr === 'undefined') {
      return clone(obj);
    }

    if (getType(posArr) === 'string' ||
        (getType(posArr) === 'object' && !opt.__innerCall)) {
      posArr = [posArr]
    }
    opt.__innerCall = true;

    var target = createTargetObj(obj)
      , objType = getType(obj);

    for (var i = 0; i < posArr.length; i++) {
      var item = posArr[i]
        , key, value, childPos;

      if (getType(item) === 'object') {
        key = getFirstKey(item);
        childPos = item[key];
        if (getType(childPos) !== 'array') {
          childPos = [childPos];
        }
        value = copy(obj[key], childPos, opt);
      } else {
        key = item;
        value = obj[key];
      }

      if (opt.undefined || (typeof value !== 'undefined' &&
                          (typeof value !== 'object' ||  !isNullObjectOrNullArray(value)))) {

        switch (objType) {
          case 'array':
            target.push(clone(value));
            break;
          case 'object':
            target[key] = clone(value);
            break;
        }
      }
    }
    return target;
  };

  function clone (obj) {
    switch (getType(obj)) {
      case 'object':
      case 'array':
        var target = createTargetObj(obj);
        for (var prop in obj) {
          if (obj.hasOwnProperty(prop)) {
            target[prop] = clone(obj[prop]);
          }
        }
        return target;
      case 'date':
        return new Date(obj);
      default:
        return obj;
    }
  }

  function createTargetObj(obj) {
    switch (getType(obj)) {
      case 'array':
        return [];
      case 'object':
        return {};
      case 'undefined':
        return {};
      default:
        throw new TypeError(obj + ' is not a object or array');
    }
  }

  function getType(obj) {
    var type = typeof obj;
    if (type !== 'object') {
      return type;
    }
    switch (Object.prototype.toString.call(obj)) {
      case '[object Object]':
        return 'object';
      case '[object Array]':
        return 'array';
      case '[object Date]':
        return 'date';
    }
  }

  function getFirstKey(obj) {
    if (typeof obj !== 'object') {
      throw new TypeError(obj + ' is not an object');
    }
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        return key;
      }
    }
  }
  easycopy.copy = copy;
  easycopy.clone = clone;
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = easycopy.copy
    }
    exports.easycopy = easycopy
  }
  else {
    root.easycopy = easycopy
  }

  function isNullObjectOrNullArray(obj) {
    for (var key in obj) {
      return false;
    }
    return true;
  }
}).call(this);
