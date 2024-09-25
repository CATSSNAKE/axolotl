const request = require('supertest');
const db = require('../../server/models/usersModel');

/*
 * Lets make sure we are in test mode in case this is test gets executed  of 
 * npm run test:server
 */
if (process.env.NODE_ENV != 'server-test') {
  throw new Error("Tests must be run in the testing environment");
}


beforeAll(async () => {
  try {
    db.query(`
      CREATE TABLE IF NOT EXISTS users (
        user_id uuid DEFAULT gen_random_uuid() NOT NULL,
        firstname text NOT NULL,
        email text NOT NULL,
        password text NOT NULL,
        city text,
        zipcode integer,
        gender text,
        phone bigint
    );`
    );
  }
  catch (error) {
    console.log(`beforeAll database setup error: ${error} `);
    throw new Error("Error setting up sql test database")
  }
});

afterAll(() => db.end());

describe('tests', () => {
  it('does something', () => expect(1).toBe(1));
});