/**
 * Some versions of node don't have a TextEncoder / TextDecoder set as
 * enviroment variables.  This problem arose once I changed jest.mock to 
 * jest.doMock to prevent it hoisting to the top.  I'm not sure if that also 
 * somehow altered these enviroment variables.  This is a sort of "polyfil"
 * to provide those values globally.
 * 
 * see https://www.dhiwise.com/post/how-to-resolve-the-error-textencoder-is-not-defined-jes
 */
const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

const request = require('supertest');

const app = require('../../server/server');
const mockDatabase = require('./mockDatabase');



/* 
 * Here are are mocking up the entire pg module so that we can have it use the
 * in memory postgres database, and the rest of our code will use it for
 * querying the database
 */

jest.doMock('pg', () => mockDatabase());

// before all tests create the database
// after all tests maybe get rid of the database

// beforeEach maybe insert some fake data into the database for testing




// dummy test just while setting up pg-mem
describe('userController tests', () => {
  test('this is a test', () => expect(1).toBe(1));
});
