const KEYS = {
    'ArrowUp': true,
    'ArrowDown': true,
    'ArrowLeft': true,
    'ArrowRight': true,
};

export default class Keyboard {
    constructor() {
        this.states = {};
    }
    start() {
        document.addEventListener('keydown', this._onKey.bind(this, true));
        document.addEventListener('keyup', this._onKey.bind(this, false));
    }
    _onKey(newState, event) {
        const key = event.key || event.keyCode;
        if (KEYS.hasOwnProperty(key)) {
            console.log('KEY', key, '=', newState);
            this.states[key] = newState;
            event.preventDefault();
        } else {
            console.log('Unrecognized key', key);
        }
    }
    isPressed(key) {
        return this.states[key] === true;
    }
}
