const request = require('supertest');
const { newDb } = require('pg-mem');

const app = require('../../server/server');


/*
 * This testing method spins up a in memory postgres database for our endpoints
 * to test against.  We could have mocked the expected database responses 
 * completely in Jest, but here we are attempting to provide a more robust test
 * that is perhaps easier to maintain, as each database query will not need to
 * be mocked, and we can more easily update any schema changes.  The cost to 
 * this approach is test run times, but since our project is small, this might 
 * not be a problem.
 */

const db = newDb();

// create a schema for the database.  get this from the actual database

// before all tests create the database
// after all tests maybe get rid of the database

// beforeEach maybe insert some fake data into the database for testing


jest.mock('pg', () => {
  return {
    Pool: jest.fn(() => {
      return { query: (text, params) => db.public.manyOrNone(text, params) };
    })
  }
});


