import * as fs from 'fs';
import * as path from 'path';

function certsDirectory(): string {
  return path.join(require.main?.filename || '', '../../certs');
}

export const privateKey = fs.readFileSync(
  `${certsDirectory()}/private.key`,
  'utf8'
);
export const publicKey = fs.readFileSync(
  `${certsDirectory()}/public.key`,
  'utf8'
);
