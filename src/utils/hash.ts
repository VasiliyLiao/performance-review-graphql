import crypto from 'crypto';

export const getRandomSalt = () => crypto.randomBytes(128).toString('base64');

export const doHashedPassword = (password: any, salt: any): Promise<string> =>
    new Promise((resolve, reject) =>
        crypto.pbkdf2(password, salt, 36000, 256, 'sha256', (err, hashedPassword) => {
            if (err) {
                reject(err);
                return;
            }
            const hash = hashedPassword.toString('hex');
            resolve(hash);
        }));
