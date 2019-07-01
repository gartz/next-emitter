import t from 'tap';

export function sharedTests (config, createInstance) {
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

  t.test('Should execute callbacks only the event in the emit', t => {
    const ee = t.context.ee;
    let notToCall = false;
    let toCall = false;

    ee.subscribe('test_not_to_call', () => {
      notToCall = true;
    });
    ee.subscribe('test_to_call', () => {
      toCall = true;
    });

    ee.emit('test_to_call');
    t.assertNot(notToCall);
    t.assert(toCall);
    t.end();
  });

  t.test('Should method once', t => {
    t.test('execute callback once', t => {
      const ee = t.context.ee;

      let callbackExecCount = 0;
      const callback = () => {
        callbackExecCount++;
      };

      ee.once('test', callback);
      ee.emit('test');
      t.assert(callbackExecCount === 1);
      ee.emit('test');
      t.assert(callbackExecCount === 1);
      t.end();
    });

    t.test('when event name has not emit, not be called', t => {
      const ee = t.context.ee;

      let callbackExecCount = 0;
      const callback = () => {
        callbackExecCount++;
      };

      ee.once('test', callback);
      ee.emit('another_test');
      t.assert(callbackExecCount === 0);
      t.end();
    });

    if (config.hasMethodUnsubscribe) {
      t.test('when unsubscribe the event, not be called', t => {
        const ee = t.context.ee;

        let callbackExecCount = 0;
        const callback = () => {
          callbackExecCount++;
        };

        ee.once('test', callback);
        ee.unsubscribe('test', callback);
        ee.emit('test');
        t.assert(callbackExecCount === 0);
        t.end();
      });

      t.test('when unsubscribe all callbacks, not be called', t => {
        const ee = t.context.ee;

        let callbackExecCount = 0;
        const callback = () => {
          callbackExecCount++;
        };

        ee.once('test', callback);
        ee.unsubscribe('test');
        ee.emit('test');
        t.assert(callbackExecCount === 0);
        t.end();
      });

      t.test('when unsubscribe another event, call the original event', t => {
        const ee = t.context.ee;

        let callbackToBeCalled = false;
        const callback = () => {
          callbackToBeCalled = true;
        };

        let callbackToNotBeCalled = false;
        const callbackNotBeCalled = () => {
          callbackToNotBeCalled = true;
        };

        ee.once('test_to_be_called', callback);
        ee.once('test_to_not_be_called', callbackNotBeCalled);
        ee.unsubscribe('test_to_not_be_called');
        ee.emit('test_to_be_called');
        ee.emit('test_to_not_be_called');
        t.assert(callbackToBeCalled);
        t.assertNot(callbackToNotBeCalled);
        t.end();
      });

      t.test('when unsubscribe another event with same callback, not remove from both', t => {
        const ee = t.context.ee;

        let sharedCallbackCount = 0;
        const callback = () => {
          sharedCallbackCount++;
        };

        ee.once('test_to_be_called', callback);
        ee.once('test_to_not_be_called', callback);
        ee.unsubscribe('test_to_not_be_called');
        ee.emit('test_to_be_called');
        ee.emit('test_to_not_be_called');
        t.assert(sharedCallbackCount === 1);
        t.end();
      });
    }

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
}
