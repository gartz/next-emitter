// Functional implementation, in this way unsubscribe is the return of subscribe and once methods.
// Example:
//
// WeakEventEmitter({});

const weakMap = new WeakMap();

function getOrSetEventsMap (instance) {
  if (weakMap.has(instance)) {
    return weakMap.get(instance);
  }
  const eventsMap = new Map();
  weakMap.set(instance, eventsMap);
  return eventsMap;
}

function subscribe (name, callback) {
  const eventsMap = getOrSetEventsMap(this);

  if (!eventsMap.has(this)) {
    eventsMap.set(name, new Set());
  }

  eventsMap.add(callback);
  return () => {
    eventsMap.get(name).delete(callback);
  }
}

function once (name, callback) {
  let unsubscribe;
  const onceCallback = (...args) => {
    unsubscribe();
    callback(...args);
  };
  unsubscribe = this.subscribe(name, onceCallback)
  return unsubscribe;
}

function emit (name, ...args) {
  const eventsMap = getOrSetEventsMap(this);

  if (eventsMap.has(name)) {
    eventsMap.get(name).forEach(callback => callback(...args));
  }
}

function WeakEventEmitter (object) {
  object.subscribe = subscribe;
  object.once = once;
  object.emit = emit;
  return object;
}

export default WeakEventEmitter;
