// Functional with context binding implementation, in this way unsubscribe is the return of subscribe and once methods.
// Example:
//
// CopyEventEmitter({});

const EVENTS = Symbol('events');

function subscribe (name, callback) {
  if (!this[EVENTS].has(this)) {
    this[EVENTS].set(name, new Set());
  }
  const eventsMap = this[EVENTS].get(name);
  eventsMap.add(callback);
  return () => {
    eventsMap.get(name).delete(callback);
  };
}

function once (name, callback) {
  let unsubscribe;
  const onceCallback = (...args) => {
    unsubscribe();
    callback(...args);
  };
  unsubscribe = this.subscribe(name, onceCallback);
  return unsubscribe;
}

function emit (name, ...args) {
  if (this[EVENTS].has(name)) {
    this[EVENTS].get(name).forEach(callback => callback(...args));
  }
}

function CopyEventEmitter (object) {
  object[EVENTS] = new Map();
  object.subscribe = subscribe;
  object.once = once;
  object.emit = emit;
  return object;
}

CopyEventEmitter.EVENTS = EVENTS;

export default CopyEventEmitter;
