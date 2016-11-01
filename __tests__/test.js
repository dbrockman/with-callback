"use strict";

const withCallback = require('../index');


test('that the promise resolves with the first value passed to the callback', () => {
  return withCallback(fnMultiValue).then(value => {
    expect(value).toBe('a');
  });
});

test('that a mapper function can be used to map multiple callback arguments to a single value', () => {
  return withCallback(fnMultiValue, joinArgs).then(value => {
    expect(value).toBe('(join 3 args: a, b, c)');
  });
});

test('that arguments can be passed as an array', () => {
  return withCallback(['a', 'b', 'c'], fnSingleValueArgs).then(value => {
    expect(value).toBe('(called with 3 args: a, b, c)');
  });
});

test('that the mapper is called when passing arguments', () => {
  return withCallback(['a', 'b', 'c'], fnSingleValueArgs, joinArgs).then(value => {
    expect(value).toBe('(join 1 args: (called with 3 args: a, b, c))');
  });
});

test('that the promise rejects if the callback is passed an error', () => {
  withCallback(fnFail).then(() => {
    expect().toBe('should have thrown');
  }, err => {
    expect(err).toBeInstanceOf(Error);
    expect(err.message).toBe('test error');
  });
});

test('that the promise rejects if the value mapper throws an error', () => {
  withCallback(fnSingleValue, fnThrows).then(() => {
    expect().toBe('should have thrown');
  }, err => {
    expect(err).toBeInstanceOf(Error);
    expect(err.message).toBe('thrown test error');
  });
});


function fnFail(callback) {
  setImmediate(callback, new Error('test error'));
}

function fnThrows() {
  throw new Error('thrown test error');
}

function fnSingleValue(callback) {
  setImmediate(callback, null, 'value');
}

function fnMultiValue(callback) {
  setImmediate(callback, null, 'a', 'b', 'c');
}

function fnSingleValueArgs() {
  const args = [].slice.call(arguments);
  const callback = args.pop();
  const value = `(called with ${args.length} args: ${args.join(', ')})`;
  setImmediate(callback, null, value);
}

function joinArgs() {
  const args = [].slice.call(arguments);
  return `(join ${args.length} args: ${args.join(', ')})`;
}
