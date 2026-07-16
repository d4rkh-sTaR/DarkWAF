
import { SQLInjection } from 'libinjection';
import { base64decode } from './utils.js';
const libinj = new SQLInjection();

export function checkSqli(value) {
    
    const data = base64decode(value) || value;

    return libinj.has(data);
}
