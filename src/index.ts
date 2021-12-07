import fastify from 'fastify';
import fastifyJwt from 'fastify-jwt';
import * as inputValidation from 'openapi-validator-middleware';

import { APIv0 } from './routes/v0/root';
import { Database } from './data/db/db';
import { generateErrorMessage } from './utils/errors';

const server = fastify({ logger: true });
const db = new Database();

server.setErrorHandler(generateErrorMessage);

// Adding OpenAPI input validation  to the pipeline
inputValidation.init('specs/api-v0.yml', { framework: 'fastify' });
server.register(inputValidation.validate({}));

// Adding JWT validation to the pipeline
server.register(fastifyJwt, {
  secret: process.env.JWT_SECRET as string,
});

// Main async function of app
async function main() {
  await db.initDB();

  // Registering all main routes of API
  const v0 = new APIv0(db);
  server.register(v0.routeReg, { prefix: 'v0' });
  server.register(v0.routeReg);

  server.listen(
    process.env.HTTP_PORT || 8000,
    process.env.HTTP_ADDRESS || '127.0.0.1',
    (err, address) => {
      if (err) throw err;
      console.log('Server listening at', address);
    }
  );
}
main();
