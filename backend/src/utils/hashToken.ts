import crypto from 'crypto';

/**
 * Hashes a token using the SHA-512 algorithm.
 * @param token The token to be hashed.
 * @returns The hashed token.
 */
export function hashToken(token: any): string {

    // Create a hash object using the SHA-512 algorithm
    const hash = crypto.createHash('sha512');

    // Update the hash object with the token
    hash.update(token);

    // Generate the hashed token in hexadecimal format
    return hash.digest('hex');
}
