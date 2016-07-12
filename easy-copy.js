'use strict';

(function () {
  var easycopy = {};
  var root = this;

  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = easycopy
    }
    exports.mymodule = easycopy
  }
  else {
    root.mymodule = easycopy
  }

  var copy = easycopy.copy = function (obj, posArr) {
    var target = createTargetObj(obj)
      , objType = getType(obj);

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
  };

  var clone = easycopy.clone = function (obj) {
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
  };

  function createTargetObj(obj) {
    var target;
    switch (getType(obj)) {
      case 'array':
        target = [];
        break;
      case 'object':
        target = {};
        break;
      default:
        throw new TypeError(obj + ' is not a object or array');
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
        case '[object Date]':
          return 'date';
      }
    } else {
      return type;
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

}).call(this);
