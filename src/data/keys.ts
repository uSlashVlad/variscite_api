import * as fs from 'fs';

export const privateKey = fs.readFileSync(
  `certs/private.key`,
  'utf8'
);
export const publicKey = fs.readFileSync(
  `certs/public.key`,
  'utf8'
);
