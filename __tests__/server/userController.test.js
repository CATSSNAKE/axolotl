const request = require('supertest');
const db = require('../../server/models/usersModel');

/*
 * Lets make sure we are in "test mode", so that we don't accidently operate
 * on the real database
 */
if (process.env.NODE_ENV != 'server-test') {
  throw new Error("Tests must be run in the testing environment");
}

beforeAll(async () => {
  try {
    db.query(`
      CREATE TABLE IF NOT EXISTS users (
        user_id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
        firstname text NOT NULL,
        email text NOT NULL UNIQUE,
        password text NOT NULL,
        city text,
        zipcode integer,
        gender text,
        phone bigint
      );

      CREATE TABLE IF NOT EXISTS useractivities (
        "useractivityId" uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
        user_id uuid DEFAULT gen_random_uuid(),
        activityname character varying,
        skilllevel character varying,
        FOREIGN KEY (user_id) 
        REFERENCES users(user_id) ON UPDATE CASCADE ON DELETE CASCADE
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