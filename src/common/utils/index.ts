import { v4 as uuidv4 } from 'uuid';

export function generateRandomNumber(): number {
  const min = 100000000000;
  const max = 999999999999;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateSalt(): string {
  const uuid = uuidv4();
  const base64UUID = Buffer.from(uuid)
    .toString('base64')
    .replace(/=/g, '')
    .substring(0, 12);
  return base64UUID;
}
