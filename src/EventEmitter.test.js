import t from 'tap';

import EventEmitter from './EventEmitter';

const config = {
  returnUnsubscribe: false,
  hasMethodUnsubscribe: true,
};

t.test('Should be a class', t => {
  const ee = new EventEmitter();
  t.assert(ee instanceof EventEmitter);
  t.end()
});

function createInstance() {
  return new EventEmitter();
}

t.beforeEach((done, t) => {
  t.context.ee = createInstance();
  done();
});

t.test('Should have all methods', t => {
  const ee = t.context.ee;

  t.type(ee.subscribe, 'function', 'subscribe');

  if (config.hasMethodUnsubscribe) {
    t.type(ee.unsubscribe, 'function', 'unsubscribe');
  }

  t.type(ee.once, 'function', 'once');
  t.type(ee.emit, 'function', 'emit');
  t.end();
});

t.test('Should be eventEmitter compatible', t => {
  const ee = t.context.ee;

  t.emits(ee, 'test');
  ee.emit('test');
  t.end();
});

t.test('Subscribe and emit a event', t => {
  const ee = t.context.ee;

  let callbackCalled = false;
  ee.subscribe('test', () => {
    callbackCalled = true;
  });
  ee.emit('test');
  t.assert(callbackCalled);
  t.end();  
});
    
t.test('Should pass args to the event callback', t => {
  const ee = t.context.ee;
  const arg0 = true;
  const arg1 = {};
  const arg2 = 1;

  ee.subscribe('test', (...args) => {
    t.equal(args.length, 3);
    t.equal(args[0], arg0);
    t.equal(args[1], arg1);
    t.equal(args[2], arg2);
  });
  ee.emit('test', arg0, arg1, arg2);
  t.end();
});

t.test('Should execute callbacks in order', t => {
  const ee = t.context.ee;
  let i = 0;

  ee.subscribe('test', () => {
    t.equal(i, 0);
    i = 1;
  });
  ee.subscribe('test', () => {
    t.equal(i, 1);
  });

  ee.emit('test');
  t.end();
});


if (config.hasMethodUnsubscribe) {
  t.test('Should method unsubscribe', t => {

    t.test('when pass name and callback, unsubscribe the callback', t => {
      const ee = t.context.ee;

      let callbackCalled = false;
      const callback = () => {
        callbackCalled = true;
      };

      ee.subscribe('test', callback);
      ee.unsubscribe('test', callback);
      ee.emit('test');
      t.assertNot(callbackCalled);
      t.end();
    });

    t.test('when the callback is different, not remove other callback', t => {
      const ee = t.context.ee;

      let callbackCalled = false;
      const callback = () => {
        callbackCalled = true;
      };

      ee.subscribe('test', callback);
      ee.unsubscribe('test', () => {});
      ee.emit('test');
      t.assert(callbackCalled);
      t.end();
    });

    t.test('when no callback defined, remove all callbacks of the event', t => {
      const ee = t.context.ee;

      let callbackCalled = false;
      const callback = () => {
        callbackCalled = true;
      };

      ee.subscribe('test', callback);
      ee.unsubscribe('test');
      ee.emit('test');
      t.assertNot(callbackCalled);
      t.end();
    });

    t.test('Should do nothing if no event name', t => {
      const ee = t.context.ee;

      let callbackCalled = false;
      const callback = () => {
        callbackCalled = true;
      };

      ee.subscribe('test', callback);
      ee.unsubscribe();
      ee.emit('test');
      t.assert(callbackCalled);
      t.end();
    });

    t.end();
  });
}

t.type(EventEmitter, 'function', 'Should be a function');

t.type(EventEmitter.constructor, 'function');


// tap.test('is true', t => {
//   t.equal('foo', 'bar');
//   t.end();
// });

