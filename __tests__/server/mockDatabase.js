/*
 * This testing method spins up a in memory postgres database for our endpoints
 * to test against.  We could have mocked the expected database responses 
 * completely in Jest, but here we are attempting to provide a more robust test
 * that is perhaps easier to maintain, as each database query will not need to
 * be mocked, and we can more easily update any schema changes.  The cost to 
 * this approach is test run times, but since our project is small, this might 
 * not be a problem. 
 * This approach might also be a bit faster than setting up a local or remote
 * test server, with less to configure as well.
 */
const { newDb } = require('pg-mem');
/**
 * Unfortuantely pg-mem does not include a lot of built in postgres
 * functionality.  Our actual database uses gen_random_uuid() to create ids.
 * pg-mem does not support this by default, so we have to create it ourselves.
 */
const { v4 } = require('uuid');


const mockDatabase = () => {
  const db = newDb();

  db.public.none(`
    CREATE TABLE users (
      user_id uuid DEFAULT gen_random_uuid() NOT NULL,
      firstname text NOT NULL,
      email text NOT NULL,
      password text NOT NULL,
      city text,
      zipcode integer,
      gender text,
      phone bigint
  );
    ALTER TABLE ONLY users
      ADD CONSTRAINT "Users_pkey" PRIMARY KEY (user_id);

    ALTER TABLE ONLY users
      ADD CONSTRAINT "Users_username_key" UNIQUE (email);

    CREATE TABLE useractivities (
      "useractivityId" uuid DEFAULT gen_random_uuid() NOT NULL,
      user_id uuid DEFAULT gen_random_uuid(),
      activityname character varying,
      skilllevel character varying
  );

    ALTER TABLE ONLY useractivities
      ADD CONSTRAINT useractivities_pkey PRIMARY KEY ("useractivityId");
    ALTER TABLE ONLY useractivities
      ADD CONSTRAINT useractivities_user_id_fkey FOREIGN KEY (user_id) 
      REFERENCES users(user_id) ON UPDATE CASCADE ON DELETE CASCADE;
  `);

  /*
   * we need to supply gen_random_uuid because its not built into pg-mem,
   * and is used in our database to generate unique id's.  this function
   * will be called when our sql queries invoke it.  
   */
  db.registerFunction({
    name: 'gen_random_uuid',
    returns: 'uuid',
    implementation: v4,
    impure: true,
  });

  const mockPool = {
    query: (text, params) => db.public.manyOrNone(text, params)
  };

  return {
    Pool: jest.fn(() => mockPool)
  };
};

module.exports = mockDatabase;