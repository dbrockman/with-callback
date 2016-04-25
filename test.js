import test from 'ava';
import withCallback from './index';


test('that the promise resolves with the first value passed to the callback', t => {
  return withCallback(fnMultiValue).then(value => {
    t.is(value, 'a');
  });
});

test('that a mapper function can be used to map multiple callback arguments to a single value', t => {
  return withCallback(fnMultiValue, joinArgs).then(value => {
    t.is(value, '(join 3 args: a, b, c)');
  });
});

test('that arguments can be passed as an array', t => {
  return withCallback(['a', 'b', 'c'], fnSingleValueArgs).then(value => {
    t.is(value, '(called with 3 args: a, b, c)');
  });
});

test('that the mapper is called when passing arguments', t => {
  return withCallback(['a', 'b', 'c'], fnSingleValueArgs, joinArgs).then(value => {
    t.is(value, '(join 1 args: (called with 3 args: a, b, c))');
  });
});

test('that the promise rejects if the callback is passed an error', t => {
  const promise = withCallback(fnFail);
  return t.throws(promise, 'test error');
});

test('that the promise rejects if the value mapper throws an error', t => {
  const promise = withCallback(fnSingleValue, fnThrows);
  return t.throws(promise, 'thrown test error');
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

function fnSingleValueArgs(...args) {
  const callback = args.pop();
  const value = `(called with ${args.length} args: ${args.join(', ')})`;
  setImmediate(callback, null, value);
}

function joinArgs(...args) {
  return `(join ${args.length} args: ${args.join(', ')})`;
}
