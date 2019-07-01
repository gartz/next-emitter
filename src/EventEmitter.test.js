import t from 'tap';
import { sharedTests, } from './dev/sharedTests';

import EventEmitter from './EventEmitter';

const config = {
  returnUnsubscribe: false,
  hasMethodUnsubscribe: true,
};

t.test('Should be a class', t => {
  const ee = new EventEmitter();
  t.assert(ee instanceof EventEmitter);
  t.end();
});

function createInstance () {
  return new EventEmitter();
}

sharedTests(config, createInstance);

t.type(EventEmitter, 'function', 'Should be a function');
t.type(EventEmitter.constructor, 'function');
