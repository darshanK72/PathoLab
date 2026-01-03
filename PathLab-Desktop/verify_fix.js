import { getMachineId } from './electron/license.js';
import os from 'os';

console.log('OS Platform:', os.platform());
console.log('OS Release:', os.release());

try {
    const id = getMachineId();
    console.log('Generated Machine ID:', id);
    if (id) {
        console.log('✅ Verification Successful: ID generated.');
    } else {
        console.error('❌ Verification Failed: No ID generated.');
        process.exit(1);
    }
} catch (error) {
    console.error('❌ Verification Failed with error:', error);
    process.exit(1);
}
