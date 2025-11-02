import { beforeAll, describe, expect, test } from 'vitest';
import { comparePassword, hashPassword } from '../../utils/password-hash.js';

describe('hashPassword', () => {

    test('hashPassword hashes a normal password', async () => {
        const password = 'mySecurePassword';
        const hashed = await hashPassword(password);
        expect(hashed).not.toBe(password);
    });

    test('hashPassword throws on empty, null, or undefined', async () => {
        await expect(hashPassword('')).rejects.toThrow('Password is required');
        // @ts-ignore
        await expect(hashPassword(null)).rejects.toThrow('Password is required');
        // @ts-ignore
        await expect(hashPassword(undefined)).rejects.toThrow('Password is required');
    });

    test('hashPassword handles long passwords', async () => {
        const longPassword = 'a'.repeat(10000);
        const hashed = await hashPassword(longPassword);
        expect(hashed).not.toBe(longPassword);
    });

    test('hashPassword handles special/unicode characters', async () => {
        const specialPassword = 'pässwörd😊!@#$%^&*()';
        const hashed = await hashPassword(specialPassword);
        expect(hashed).not.toBe(specialPassword);
    });

    test('hashPassword produces different hashes for the same password if salted', async () => {
        const password = 'repeatMe';
        const hash1 = await hashPassword(password);
        const hash2 = await hashPassword(password);
        expect(hash1).not.toBe(hash2); // only if your hash uses salt
    });
});

describe('comparePassword', () => {
  let hashed: string;
  const password = 'mySecurePassword';

  beforeAll(async () => {
    hashed = await hashPassword(password);
  });

  test('returns true for matching password', async () => {
    expect(await comparePassword(password, hashed)).toBe(true);
  });

  test('returns false for non-matching password', async () => {
    expect(await comparePassword('wrongPassword', hashed)).toBe(false);
  });

  test('throws on invalid inputs', async () => {
    // invalid passwords
    await expect(comparePassword('', hashed)).rejects.toThrow();
    //@ts-ignore
    await expect(comparePassword(null, hashed)).rejects.toThrow();
    // invalid hashes
    await expect(comparePassword(password, '')).rejects.toThrow();
    // @ts-ignore
    await expect(comparePassword(password, null)).rejects.toThrow();
  });
});
