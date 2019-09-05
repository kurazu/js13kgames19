export class Action {
    public readonly up: boolean;
    public readonly left: boolean;
    public readonly right: boolean;

    public constructor(up: boolean, left: boolean, right: boolean) {
        this.up = up;
        this.left = left;
        this.right = right;
    }
}

export const ACTIONS = [
    new Action(false, false, false), // drift
    new Action(true, false, false), // pull up
    new Action(false, true, false), // go left
    new Action(false, false, true), // go right
    new Action(true, true, false), // pull up and left
    new Action(true, false, true), // pull up and right
];
