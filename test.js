var copy = require('./copy-something');
var expect = require('chai').expect;

describe('Copy', function () {
  it('copy an array', function () {
    var obj = [1, 2, 3, 4];
    expect(copy(obj, [0, 1, 3])).to.deep.equal([1, 2, 4]);
  });
  it('copy a deep array', function () {
    var obj = [1, [2, 3, 4], 5, [6, 7, [8, 9]]];
    expect(copy(obj, [0, 1, 3])).to.deep.equal([1, [2, 3, 4], [6, 7, [8, 9]]]);
    expect(copy(obj, [{'3': [2]}])).to.deep.equal([[[8, 9]]]);
    expect(copy(obj, [{3: {2: [1]}}])).to.deep.equal([[[9]]]);
    expect(copy(obj, [0, {'1': [1]}, {'3': [2]}])).to.deep.equal([1, [3], [[8, 9]]]);
  });

  it('copy a simple object', function () {
    var obj = {a: 'a', b: 'b', c: 'c', d: 'd'};
    expect(copy(obj, ['a', 'c'])).to.deep.equal({a: 'a', c: 'c'});
  });
  it('copy a deep object', function () {
    var obj = {
      a: 'a',
      b: {b1: 'b1', b2: 'b2'},
      c: {c1: 'c1', c2: {c21: 'c21', c22: 'c22'}},
      d: {d1: 'd1', d2: {d21: 'd21', d22: {d221: 'd221', d222: 'd222'}}}
    };
    expect(copy(obj, ['a'])).to.deep.equal({a: 'a'});
    expect(copy(obj, ['b'])).to.deep.equal({b: {b1: 'b1', b2: 'b2'}});
    expect(copy(obj, [{b: ['b2']}])).to.deep.equal({b: {b2: 'b2'}});
    expect(copy(obj, [{d: ['d2']}])).to.deep.equal({d: {d2: {d21: 'd21', d22: {d221: 'd221', d222: 'd222'}}}});
    expect(copy(obj, [
      'a',
      {c: ['c2']},
      {d: ['d1', {d2: 'd22'}]}
    ])).to.deep.equal({
      a: 'a',
      c: {c2: {c21: 'c21', c22: 'c22'}},
      d: {d1: 'd1', d2: {d22: {d221: 'd221', d222: 'd222'}}}
    })
  });

  it('should be an deep copy for array', function () {
    var arr = [1, [2, [3, 4]]];
    var copyedArr = copy(arr, [0, {1: {1: 1}}]);
    expect(copyedArr).to.deep.equal([1, [[4]]]);
    arr[1][1][1] = 5;
    expect(copyedArr).to.deep.equal([1, [[4]]]);
  });
  it('should be an deep copy for object', function () {
    var obj = { a: { b: { c: { d: 'foo' } } }, e:'bar' };
    var copyedObj = copy(obj, [{a:{b:{c:'d'}}}]);
    expect(copyedObj).to.deep.equal({a: { b: { c: { d: 'foo' } } } });
    obj.a.b.c.d = 'baz';
    obj.a.b = 'bar';
    expect(copyedObj).to.deep.equal({a: { b: { c: { d: 'foo' } } } });
  });
});
