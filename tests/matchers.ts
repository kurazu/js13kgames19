interface MatcherResult {
    message: () => string,
    pass: boolean
}

expect.extend({
    toEqualFloat32Array(received: any, expected: Float32Array): MatcherResult {
        if (!(received instanceof Float32Array)) {
            return {
                message: () => `expected Float32Array, but got ${received.constructor}`,
                pass: false
            };
        } else if (received.length !== expected.length) {
            return {
                message: () => `expected length ${expected.length}, but got ${received.length}`,
                pass: false
            }
        }
        for (const [idx, actual] of received.entries()) {
            const exp = expected[idx];
            if (Math.abs(exp - actual) > 1e-10) {
                return {
                    message: () => `expected element at ${idx} to be close to ${exp} but got ${actual}`,
                    pass: false
                }
            }
        }

        return {pass: true, message: () => ''};
    }
});
