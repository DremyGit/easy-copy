var easycopy = require('./easy-copy');
var expect = require('chai').expect;
var clone = easycopy;


describe('easecopy', function () {
  describe('easycopy()', function () {
    it('easycopy an array', function () {
      var obj = [1, 2, 3, 4];
      expect(easycopy(obj, [0, 1, 3])).to.deep.equal([1, 2, 4]);
    });
    it('easycopy a deep array', function () {
      var obj = [1, [2, 3, 4], 5, [6, 7, [8, 9]]];
      expect(easycopy(obj, [0, 1, 3])).to.deep.equal([1, [2, 3, 4], [6, 7, [8, 9]]]);
      expect(easycopy(obj, [{'3': [2]}])).to.deep.equal([[[8, 9]]]);
      expect(easycopy(obj, [{3: {2: [1]}}])).to.deep.equal([[[9]]]);
      expect(easycopy(obj, [0, {'1': [1]}, {'3': [2]}])).to.deep.equal([1, [3], [[8, 9]]]);
    });

    it('easycopy a simple object', function () {
      var obj = {a: 'a', b: 'b', c: 'c', d: 'd'};
      expect(easycopy(obj, ['a', 'c'])).to.deep.equal({a: 'a', c: 'c'});
    });
    it('easycopy a deep object', function () {
      var obj = {
        a: 'a',
        b: {b1: 'b1', b2: 'b2'},
        c: {c1: 'c1', c2: {c21: 'c21', c22: 'c22'}},
        d: {d1: 'd1', d2: {d21: 'd21', d22: {d221: 'd221', d222: 'd222'}}}
      };
      expect(easycopy(obj, ['a'])).to.deep.equal({a: 'a'});
      expect(easycopy(obj, ['b'])).to.deep.equal({b: {b1: 'b1', b2: 'b2'}});
      expect(easycopy(obj, [{b: ['b2']}])).to.deep.equal({b: {b2: 'b2'}});
      expect(easycopy(obj, [{d: ['d2']}])).to.deep.equal({d: {d2: {d21: 'd21', d22: {d221: 'd221', d222: 'd222'}}}});
      expect(easycopy(obj, [
        'a',
        {c: ['c2']},
        {d: ['d1', {d2: 'd22'}]}
      ])).to.deep.equal({
        a: 'a',
        c: {c2: {c21: 'c21', c22: 'c22'}},
        d: {d1: 'd1', d2: {d22: {d221: 'd221', d222: 'd222'}}}
      })
    });

    it('should be an deep easycopy for array', function () {
      var arr = [1, [2, [3, 4]]];
      var copyedArr = easycopy(arr, [0, {1: {1: 1}}]);
      expect(copyedArr).to.deep.equal([1, [[4]]]);
      arr[1][1][1] = 5;
      expect(copyedArr).to.deep.equal([1, [[4]]]);
    });
    it('should be an deep easycopy for object', function () {
      var obj = { a: { b: { c: { d: 'foo' } } }, e:'bar' };
      var copyedObj = easycopy(obj, [{a:{b:{c:'d'}}}]);
      expect(copyedObj).to.deep.equal({a: { b: { c: { d: 'foo' } } } });
      obj.a.b.c.d = 'baz';
      obj.a.b = 'bar';
      expect(copyedObj).to.deep.equal({a: { b: { c: { d: 'foo' } } } });
    });
    it('copy a mixed object', function () {
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
      expect(bar).to.deep.equal(
        [{
          a: [1, 2, 3]
        }, {
          c: [
            {d: 6}
          ]
        }]
      );
    });
    it('filter is a string', function() {
      var foo = {
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
      var copyedObj = easycopy(foo, 'children');
      expect(copyedObj).to.deep.equal({
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
      })
    })
    it('filter is an object', function () {
      var foo = {
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
      };
      var copyedObj = easycopy(foo, {children: [{1: 'children'}, 2]});
      expect(copyedObj).to.deep.equal({
        children: [
          {
            children: [
              { id: 4, children: [] },
              { id: 5, children: [] }
            ]
          },
          { id: 6, children: [] }
        ]
      })

      expect(easycopy(foo, {children: {1: 'children', 2: 'children'}})).to.deep.equal({
        children: [
          {
            children: [
              { id: 4, children: [] },
              { id: 5, children: [] }
            ]
          },
          {
            children: []
          }
        ]
      })
    })
  });

  describe('clone()', function () {
    it('should be an deep easycopy for array', function () {
      var arr = [1, 2, [3, 4], [5, [6, 7]]];
      var clonedArr = clone(arr);
      expect(clonedArr).to.deep.equal([1, 2, [3, 4], [5, [6, 7]]]);
      arr[1] = arr[3][1][1] = 0;
      expect(clonedArr).to.deep.equal([1, 2, [3, 4], [5, [6, 7]]]);
      arr[2] = 0;
      expect(clonedArr).to.deep.equal([1, 2, [3, 4], [5, [6, 7]]]);
    });
    it('should be an deep easycopy for object', function () {
      var obj = {a: 1, b: {c: 2}, d: {e: {f: 3}}};
      var clonedObj = clone(obj);
      expect(clonedObj).to.deep.equal({a: 1, b: {c: 2}, d: {e: {f: 3}}});
      obj.b.c = obj.d.e = 3;
      expect(clonedObj).to.deep.equal({a: 1, b: {c: 2}, d: {e: {f: 3}}});
      obj.b = 4;
      expect(clonedObj).to.deep.equal({a: 1, b: {c: 2}, d: {e: {f: 3}}});
    });
    it('clone width a date object', function () {
      var obj = {a: 1, b: new Date()};
      var clonedObj = clone(obj);
      expect(clonedObj).to.deep.equal(obj);
      expect(clonedObj.b).not.equal(obj.b);
    })
  });

  describe('face to undefined: ', function () {
    it('copy null', function () {
      expect(easycopy()).to.deep.equal({});
    });
    it('copy undefined proptypes of obj default', function () {
      var obj = {a: 1, b: 2, c: 3};
      var copyedObj = easycopy(obj, ['a', 'e']);
      expect(copyedObj).to.deep.equal({a: 1, e: undefined})
    });

    it('copy undefined index of array default', function () {
      var arr = [1, 2, 3, 4];
      var copyedArr = easycopy(arr, [1, 5, 8]);
      expect(copyedArr).to.deep.equal([2, undefined, undefined]);
    });

    it('copy undefined proptypes of deep object default', function () {
      var obj = {
        a: 'a',
        b: {b1: 'b1', b2: 'b2'},
        c: {c1: 'c1', c2: {c21: 'c21', c22: 'c22'}},
        d: {d1: 'd1', d2: {d21: 'd21', d22: {d221: 'd221', d222: 'd222'}}}
      };
      var copyedObj = easycopy(obj, ['b', {c: ['c1', {c2: ['c21', 'c23']}, 'c3']}, {d: 'd3'}, {e: ['e1', {e2: 'e33'}]}]);
      expect(copyedObj).to.deep.equal({
        b: {b1: 'b1', b2: 'b2'},
        c: {c1: 'c1', c2: {c21: 'c21', c23: undefined}, c3: undefined},
        d: {d3: undefined},
        e: {e1: undefined, e2: {e33: undefined}}
      });
    })

    it('did not copy undefined proptypes of object by setting', function () {
      var obj = {a: 1, b: 2, c:3};
      var copyedObj = easycopy(obj, ['a', 'e'], {undefined: false});
      expect(copyedObj).to.deep.equal({a: 1});
    });

    it('did not copy undefined index of array default', function () {
      var arr = [1, 2, 3, 4];
      var copyedArr = easycopy(arr, [1, 5, 8], {undefined: false});
      expect(copyedArr).to.deep.equal([2]);
    });

    it('did not copy undefined proptypes of deep object by setting', function () {
      var obj = {
        a: 'a',
        b: {b1: 'b1', b2: 'b2'},
        c: {c1: 'c1', c2: {c21: 'c21', c22: 'c22'}},
        d: {d1: 'd1', d2: {d21: 'd21', d22: {d221: 'd221', d222: 'd222'}}}
      };
      var copyedObj = easycopy(obj, ['b', {c: ['c1', {c2: ['c21', 'c23']}, 'c33']}, {d: 'd3'}, {e: ['e1', {e2: 'e33'}]}], {undefined: false});
      expect(copyedObj).to.deep.equal({
        b: {b1: 'b1', b2: 'b2'},
        c: {c1: 'c1', c2: {c21: 'c21'}},
        d: {}
      });
    })
  })
});

describe('Use some nature filter', function () {

  it('filter is a object', function () {
    var obj = {
      a: 'a',
      b: {b1: 'b1', b2: 'b2'},
      c: {c1: 'c1', c2: {c21: 'c21', c22: 'c22'}},
      d: {d1: 'd1', d2: {d21: 'd21', d22: {d221: 'd221', d222: 'd222'}}, d3: {d31: 'd31'}}
    };
    expect(easycopy(obj, {b: 'b1', c: 'c2', d: {d2: 'd21', d3: 'd31'}})).to.deep.equal({
      b: {b1: 'b1'},
      c: {c2: {c21: 'c21', c22: 'c22'}},
      d: {d2: {d21: 'd21'}, d3: {d31: 'd31'}}
    })
  });

  it('filter is a object, but has undefined proptypes', function () {
    var obj = {
      a: 'a',
      b: {b1: 'b1', b2: 'b2'},
      c: {c1: 'c1', c2: {c21: 'c21', c22: 'c22'}},
      d: {d1: 'd1', d2: {d21: 'd21', d22: {d221: 'd221', d222: 'd222'}}, d3: {d31: 'd31'}}
    };
    expect(easycopy(obj, {b: 'b1', c: 'c3', d: {d2: 'd21', d6: 'd61'}})).to.deep.equal({
      b: {b1: 'b1'},
      c: {c3: undefined},
      d: {d2: {d21: 'd21'}, d6: {d61: undefined}}
    });
    expect(easycopy(obj, {b: 'b1', c: 'c3', d: {d2: 'd21', d6: 'd61'}}, {undefined: false})).to.deep.equal({
      b: {b1: 'b1'},
      c: {},
      d: {d2: {d21: 'd21'}}
    })
  })
})

describe('Options.undefined', function() {
  var obj = {
    a: 1,
    b: 'bcd',
    c: [],
    d: {},
    e: [{}],
    f: null,
    g: undefined
  };
  var filter = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  it('is true', function() {
    expect(easycopy(obj, filter, {undefined: true})).to.deep.equal({
      a: 1,
      b: 'bcd',
      c: [],
      d: {},
      e: [{}],
      f: null,
      g: undefined,
      h: undefined
    })
  });
  it('is false', function() {
    expect(easycopy(obj, filter, {undefined: false})).to.deep.equal({
      a: 1,
      b: 'bcd',
      c: [],
      d: {},
      e: [{}],
      f: null
    })
  })
});