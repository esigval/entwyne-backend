import crypto from 'crypto';

const generateSecret = () => crypto.randomBytes(36).toString('hex');

generateSecret();

console.log(generateSecret());