// Compatible with Object.create
// Example:
//
// Object.create(PrototypeEventEmitter, {});

const weakMap = new WeakMap();

function getOrSetEventsMap (instance) {
  if (weakMap.has(instance)) {
    return weakMap.get(instance);
  }
  const eventsMap = new Map();
  weakMap.set(instance, eventsMap);
  return eventsMap;
}

const PrototypeEventEmitter = {
  subscribe: function (name, callback) {
    const eventsMap = getOrSetEventsMap(this);

    if (!eventsMap.has(this)) {
      eventsMap.set(name, new Set());
    }
    eventsMap.get(name).add(callback);
  },

  unsubscribe: function (name, callback) {
    const eventsMap = getOrSetEventsMap(this);

    if (eventsMap.has(name)) {
      eventsMap.get(name).delete(callback);
    }
  },

  once: function (name, callback) {
    const onceCallback = (...args) => {
      this.unsubscribe(name, onceCallback);
      callback(...args);
    };
    this.subscribe(name, onceCallback);
  },

  emit: function (name, ...args) {
    const eventsMap = getOrSetEventsMap(this);

    if (eventsMap.has(name)) {
      eventsMap.get(name).forEach(callback => callback(...args));
    }
  },
};

export default PrototypeEventEmitter;
