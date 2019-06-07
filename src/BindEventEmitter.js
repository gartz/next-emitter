// Functional with context binding implementation, in this way unsubscribe is the return of subscribe and once methods.
// Example:
//
// BindEventEmitter({});

const EVENTS = Symbol();

function subscribe(name, callback) {
    if (!this[EVENTS].has(this)) {
        this[EVENTS].set(name, new Set());
    }
    const eventsMap = this[EVENTS].get(name);
    eventsMap.add(callback);
    return () => {
        eventsMap.get(name).delete(callback);
    }
}

function once(name, callback) {
    let unsubscribe;
    const onceCallback = (...args) => {
        unsubscribe();
        callback(...args);
    };
    return unsubscribe = this.subscribe(name, onceCallback);
}

function emit(name, ...args) {
    if (this[EVENTS].has(name)) {
        this[EVENTS].get(name).forEach(callback => callback(...args));
    }
}

function BindEventEmitter(object) {
    object[EVENTS] = new Map();
    object.subscribe = subscribe.bind(object);
    object.once = once.bind(object);
    object.emit = emit.bind(object);
    return object;
}

BindEventEmitter.EVENTS = EVENTS;

export default BindEventEmitter;
