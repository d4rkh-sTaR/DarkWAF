/**
 * LibInjection Wrapper (Node.js)
 */

import { SQLInjection } from 'libinjection';
const libinj = new SQLInjection();

export function checkSqli(value) {
    // Uses the real native C++ libinjection library!
    return libinj.has(value);
}
