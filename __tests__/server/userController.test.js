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

        /*
         * We probably do not actually need bcrypt here for these
         * deletion tests
         */
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash('password', saltRounds);
        results = await db.query(
          `INSERT INTO users (firstname, email, password, city, zipcode, gender, phone)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          RETURNING *` ,
          ['bill', 'bill@bill.com', hashedPassword, null, null, null, null]
        );
        console.log("results:", results);
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

    it('returns a 200 OK response', () => {
      return request(app)
        .delete('/delete')
        .send({ email: results.rows[0].email })
        .set('Content-Type', 'application/json')
        .expect(200);
    });

    it('returns a json object', async () => {
      const response = await request(app)
        .delete('/delete')
        .send({ email: results.rows[0].email })
        .set('Content-Type', 'application/json')
        .expect('Content-type', /json/);

      console.log('response.body', response.body);
      return expect(response.body).toBeDefined();
    });

    it('it deletes the correct user from the database', async () => {
      const response = await request(app)
        .delete('/delete')
        .send({ email: results.rows[0].email })
        .set('Content-Type', 'application/json')
        .expect('Content-type', /json/);

      const selectResult = await db.query(
        'SELECT * FROM users WHERE email = $1', [results.rows[0].email]
      );
      return expect(selectResult.rows.length).toBe(0);
    });

    /*
     * We expect this test to fail. Currently there is no validation of a
     * proper email being send to the server.  We would probably want to 
     * actually send back a json response ultimately.  This just expects
     * the global error handler to pick it up.
     */

    it('should fail went send an invalid email to the server', () => {
      return request(app)
        .delete('/delete')
        .send({ email: 'invalid-email' })
        .set('Content-Type', 'application/json')
        .expect(500);
    });

  });

  describe('tests', () => {
    it('does something', () => expect(1).toBe(1));
  });

});