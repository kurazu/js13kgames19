const KEYS = {
    'ArrowUp': true,
    'ArrowDown': true,
    'ArrowLeft': true,
    'ArrowRight': true,
};

export default class Keyboard {
    private states: { [key: string]: boolean; }
    public constructor() {
        this.states = {};
    }
    public start(): void {
        document.addEventListener('keydown', this._onKey.bind(this, true));
        document.addEventListener('keyup', this._onKey.bind(this, false));
    }
    private _onKey(newState: boolean, event: KeyboardEvent): void {
        const key = event.key || event.keyCode;
        if (KEYS.hasOwnProperty(key)) {
            console.log('KEY', key, '=', newState);
            this.states[key] = newState;
            event.preventDefault();
        } else {
            console.log('Unrecognized key', key);
        }
    }
    public isPressed(key: string): boolean {
        return this.states[key] === true;
    }
}
