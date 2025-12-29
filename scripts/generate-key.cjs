const crypto = require('crypto');

const SECRET_SALT = 'PATHOLAB_SECRET_2025';

function generateKey(machineId) {
    if (!machineId) {
        console.error('Error: Machine ID is required.');
        process.exit(1);
    }

    const key = crypto.createHash('sha256')
        .update(machineId + SECRET_SALT)
        .digest('hex')
        .toUpperCase()
        .substring(0, 16);

    // Format for easier reading: XXXX-XXXX-XXXX-XXXX
    const formattedKey = key.match(/.{1,4}/g).join('-');
    return formattedKey;
}

const args = process.argv.slice(2);
const mid = args[0];

if (!mid) {
    console.log('PathoLab License Key Generator');
    console.log('Usage: node scripts/generate-key.js <MACHINE_ID>');
    process.exit(0);
}

const licenseKey = generateKey(mid);
console.log('\n-----------------------------------');
console.log('Machine ID  :', mid);
console.log('License Key :', licenseKey);
console.log('-----------------------------------\n');
