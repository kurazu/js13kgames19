import { getLabel } from '../../src/learning/features';
import { Action, Actions } from '../../src/physics/actions';

describe('getLabel', () => {
    const testData: [boolean, boolean, boolean, Actions][] = [
        [false, false, false, Actions.DRIFT],
        [true, false, false, Actions.UP],
        [false, true, false, Actions.LEFT],
        [false, false, true, Actions.RIGHT],
        [true, true, false, Actions.UP_AND_LEFT],
        [true, false, true, Actions.UP_AND_RIGHT],
        [false, true, true, Actions.DRIFT],
        [true, true, true, Actions.UP],
    ];
    for (const [up, left, right, expectedLabel] of testData) {
        test(`gets the correct label for up=${up}, left=${left}, right=${right}`, () => {
            expect(getLabel(new Action(up, left, right))).toStrictEqual(expectedLabel);
        });
    }
});
