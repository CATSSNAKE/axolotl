const request = require('supertest');
const bcrypt = require('bcrypt');
const db = require('../../server/models/usersModel');
const { app, server } = require('../../server/server');

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

afterAll(async () => {
  try {
    await db.end();
    console.log("closing server")
    server.close();
  }
  catch (error) {
    throw new Error(`Error cleaning up after tests: ${error}`);
  }
});

describe('userController Tests', () => {


  describe('/login', () => {
    it('logs a user in with the correct username and password', () => {

    });
    it('sets a session cookie after logging in', () => {

    });
  });


  // get request to main in order to get 
  describe('/main', () => {
    it('logs a user in with the correct username and password', () => {

    });
    it('sets a session cookie after logging in', () => {

    });
  });


  describe('/signup', () => {
    it('adds a user to the database', () => {

    });
    it('sends a session cookie in its response', () => {

    });
  });

  // delete request to /delete endpoint
  describe('/delete', () => {
    let results;

    beforeEach(async () => {
      try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash('password', saltRounds);
        results = await db.query(
          'INSERT INTO users (firstname, email, password, city, zipcode, gender, phone) VALUES ($1, $2, $3, $4, $5, $6, $7)',
          ['bill', 'bill@bill.com', hashedPassword, null, null, null, null]
        )
      }
      catch (error) {
        throw new Error(`Unable to insert user into database: ${error}`);
      }
    });

    afterEach(async () => {
      try {
        await db.query('DELETE FROM users');
      }
      catch (error) {
        throw new Error(`Unable to delete data from users database: ${error}`);
      }
    });

    it('deletes a user from the database', () => {
      // return request(app).delete
    });
  });

});

describe('tests', () => {
  it('does something', () => expect(1).toBe(1));
});