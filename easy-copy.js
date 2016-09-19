'use strict';

(function () {
  var easycopy, copy
    , root = this;

  easycopy = copy = function (src, filter, opt) {

    src = src || {};
    opt = opt || {};
    opt.undefined = typeof opt.undefined === 'undefined' ? true : opt.undefined;


    switch (getType(filter)) {
      case 'undefined':
        return clone(src);

      case 'string':
        filter = [filter];
        break;

      case 'object':
        filter = changeObjToArray(filter);
        break
    }

    var target = createTargetObj(src);

    for (var i = 0; i < filter.length; i++) {
      var filterItem = filter[i]
        , key, value, childFilter;

      if (getType(filterItem) === 'object') {
        key = getFirstPropName(filterItem);
        childFilter = filterItem[key];

        switch (getType(childFilter)) {
          case 'array':
            break;

          case 'object':
            childFilter = changeObjToArray(childFilter);
            break;

          default:
            childFilter = [childFilter];
            break;
        }

        value = copy(src[key], childFilter, opt);

      } else {
        key = filterItem;
        value = src[key];
      }

      if (opt.undefined || getType(value) !== 'undefined') {

        switch (getType(src)) {
          case 'array':
            target.push(clone(value));
            break;
          case 'object':
            if (!opt.undefined && !src.hasOwnProperty(key)) {
              break;
            }
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
      case '[object Null]':
        return 'null'
    }
  }

  function getFirstPropName(obj) {
    if (typeof obj !== 'object') {
      throw new TypeError(obj + ' is not an object');
    }
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        return key;
      }
    }
  }

  function changeObjToArray(obj) {
    var arr = [];
    for (var childPropName in obj) {
      if (obj.hasOwnProperty(childPropName)) {
        var childObj = {};
        childObj[childPropName] = obj[childPropName];
        arr.push(childObj)
      }
    }
    return arr;
  }
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      module.exports = easycopy;
    }
    exports.easycopy = easycopy
  }
  else {
    root.easycopy = easycopy
  }
}).call(this);