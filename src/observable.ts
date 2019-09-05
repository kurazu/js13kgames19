export default class Topic<T> {
    private subscribers: Map<(value: T) => void, void>;

    public constructor() {
        this.subscribers = new Map();
    }

    public next(value: T): void {
        for (const subscriber of this.subscribers.keys()) {
            subscriber(value);
        }
    }

    public subscribe(callback: (value: T) => void) {
        this.subscribers.set(callback, undefined);
    }

    public unsubscribe(callback: (value: T) => void) {
        this.subscribers.delete(callback);
    }
}
