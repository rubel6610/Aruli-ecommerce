import { randomBytes, scryptSync, timingSafeEqual, createHash } from 'crypto';

export class CryptoUtil {
  /**
   * Hashes a plain password using scrypt with a random salt.
   */
  static hashPassword(password: string): string {
    const salt = randomBytes(16).toString('hex');
    const hash = scryptSync(password, salt, 64).toString('hex');
    return `${salt}:${hash}`;
  }

  /**
   * Compares a plain password with a stored salt:hash string.
   */
  static comparePassword(password: string, storedHash: string): boolean {
    const [salt, key] = storedHash.split(':');
    if (!salt || !key) return false;
    const hashBuffer = scryptSync(password, salt, 64);
    const keyBuffer = Buffer.from(key, 'hex');
    if (hashBuffer.length !== keyBuffer.length) return false;
    return timingSafeEqual(hashBuffer, keyBuffer);
  }

  /**
   * Generates a random session token string.
   */
  static generateRandomToken(length = 32): string {
    return randomBytes(length).toString('hex');
  }

  /**
   * Hashes a token string for safe database storage.
   */
  static hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }
}
