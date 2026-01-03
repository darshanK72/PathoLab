import crypto from 'crypto';

const FIXED_ID = 'PATHOLAB_CLIENT_FIXED_ID';
const SECRET_SALT = 'PATHOLAB_SECRET_2025'; // Extracted from license.js obfuscated code

function generateKey() {
    const key = crypto.createHash('sha256')
        .update(FIXED_ID + SECRET_SALT)
        .digest('hex')
        .toUpperCase()
        .substring(0, 16);
        
    // Format as XXXX-XXXX-XXXX-XXXX
    const formatted = key.match(/.{1,4}/g).join('-');
    
    return formatted;
}

console.log('---------------------------------------------------');
console.log('FIXED MACHINE ID: ', FIXED_ID);
console.log('LICENSE KEY:      ', generateKey());
console.log('---------------------------------------------------');
console.log('Send this key to the client. It will work on ANY machine with this build.');
