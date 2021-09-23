import { v4 as uuidv4 } from 'uuid';
import { customAlphabet } from 'nanoid';

export function genUUID(): string {
  return uuidv4();
}

const alphabet =
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const nanoid = customAlphabet(alphabet, 15);
export function genCode(): string {
  return nanoid();
}
