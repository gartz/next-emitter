import t from 'tap';
import { sharedTests, } from './dev/sharedTests';

import PrototypeEventEmitter from './PrototypeEventEmitter';

const config = {
  returnUnsubscribe: false,
  hasMethodUnsubscribe: true,
};

t.type(PrototypeEventEmitter, 'object', 'Should be an object');

function createInstance () {
  return Object.create(PrototypeEventEmitter, {});
}

sharedTests(config, createInstance);
