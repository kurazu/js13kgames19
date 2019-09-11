export const enum Key {
    UP = 'ArrowUp',
    DOWN = 'ArrowDown',
    LEFT = 'ArrowLeft',
    RIGHT = 'ArrowRight'
}

const KEYS: Key[] = [Key.UP, Key.DOWN, Key.LEFT, Key.RIGHT];

export default class Keyboard {
    private states: Map<Key, boolean>;
    private releaseWaitList: Map<Key, boolean>;

    public constructor() {
        this.states = new Map();
        this.releaseWaitList = new Map();
    }

    public start(): void {
        document.addEventListener('keydown', this._onKey.bind(this, true));
        document.addEventListener('keyup', this._onKey.bind(this, false));
    }
    private _onKey(newState: boolean, event: KeyboardEvent): void {
        const key = event.key || event.keyCode;
        if (KEYS.includes(key as Key)) {
            this.states.set(key as Key, newState);
            event.preventDefault();
        }
    }
    public isPressed(key: Key): boolean {
        return this.states.get(key) === true;
    }

    public isAnyPressed(): boolean {
        return KEYS.some(key => this.isPressed(key));
    }

    public wasPressed(key: Key): boolean {
        if (this.isPressed(key)) {
            // is pressed now
            this.releaseWaitList.set(key, true);
            return false;
        } else if (this.releaseWaitList.get(key) === true) {
            // was released now
            this.releaseWaitList.delete(key);
            return true;
        } else {
            // was not pressed yet
            return false;
        }
    }
}
