// Compatible with class extends
// Example:
//
// class Foo extends EventEmitter {
//     constructor() { super(); }
// };

const EVENTS = Symbol('EVENTS');
const ONCE_EVENTS = Symbol('ONCE_EVENTS');

export class EventEmitter {
  constructor () {
    this[EVENTS] = new Map();
    this[ONCE_EVENTS] = new WeakMap();
  }

  subscribe (name, callback) {
    if (!this[EVENTS].has(name)) {
      this[EVENTS].set(name, new Set());
    }
    this[EVENTS].get(name).add(callback);
  }

  unsubscribe (name, callback) {
    if (this[EVENTS].has(name)) {
      const callbackQueue = this[EVENTS].get(name);
      if (typeof callback === 'undefined') {
        callbackQueue.clear();
      } else {
        const hasDeleted = callbackQueue.delete(callback);
        if (!hasDeleted) {
          callbackQueue.delete(this[ONCE_EVENTS].get(callback));
        }
      }
    }
  }

  once (name, callback) {
    const onceCallback = (...args) => {
      this.unsubscribe(name, onceCallback);
      callback(...args);
    };
    this[ONCE_EVENTS].set(callback, onceCallback);
    this.subscribe(name, onceCallback);
  }

  emit (name, ...args) {
    if (this[EVENTS].has(name)) {
      this[EVENTS].get(name).forEach(callback => callback(...args));
    }
  }
}

EventEmitter.EVENTS = EVENTS;

export default EventEmitter;
