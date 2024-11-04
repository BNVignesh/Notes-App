const crypto=require('crypto');

export const secret=crypto.randomBytes(32).toString('hex');

