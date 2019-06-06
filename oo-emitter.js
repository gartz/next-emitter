const EVENTS = Symbol('EVENTS');

export default class EventEmitter {
    static EVENTS = EVENTS;

    constructor() {
        this[EVENTS] = new Map();
    }

    subscribe(name, callback) {
        if (!this[EVENTS].has(name)) {
            this[EVENTS].set(name, new Set());
        }
        this[EVENTS].get(name).add(callback);
    }

    unsubscribe(name, callback) {
        if (this[EVENTS].has(name)) {
            this[EVENTS].get(name).delete(callback);
        }
    }

    once(name, callback) {
        const onceCallback = (...args) => {
            this.unsubscribe(name, onceCallback);
            callback(...args);
        }
        this.subscribe(name, onceCallback);
    }

    emit(name, ...args) {
        if (this[EVENTS].has(name)) {
            this[EVENTS].get(name).forEach(callback => callback(...args));
        }
    }
}
