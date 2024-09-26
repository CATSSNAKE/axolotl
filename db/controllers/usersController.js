const db = require('../models/usersModel');
const bcrypt = require('bcrypt');

const usersController = {};

/**
 * Sign up a new user by receiving details (email, password, firstName, activity, city, zipCode, gender, phone)
 * - Hashes the user's password using bcrypt
 * - Checks if the email is already registered
 * - Inserts the new user into the `users` table
 * - Inserts user's activity preferences into the `useractivities` table
 * - Returns success message or an error if there was an issue
 */
usersController.signUp = async (req, res, next) => {
  const { email, password, firstName, activity, city, zipCode, gender, phone } = req.body;

  // Ensure email and password are provided
  if (!email || !password) return next({ error: 'Email and Password required!' });

  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds); // Hash the password

    // Check if email is already registered in the database
    const doesUserEmailExist = await db.query('SELECT user_id FROM users WHERE email=$1', [email]);
    if (doesUserEmailExist.rows.length > 0) {
      return next({ error: 'Account for email already exists' });
    }

    // Insert the new user into the `users` table
    await db.query(
      'INSERT INTO users (firstname, email, password, city, zipcode, gender, phone) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [firstName, email, hashedPassword, city, zipCode, gender, phone]
    );

    // Retrieve the newly created user's ID
    const userResult = await db.query('SELECT user_id FROM users WHERE email = $1', [email]);
    const userId = userResult.rows[0].user_id;

    // If activities are provided, insert them into the `useractivities` table
    if (activity && Object.keys(activity).length > 0) {
      const activityQueries = Object.entries(activity).map(([activityName, skillLevel]) =>
        db.query('INSERT INTO useractivities (user_id, activityname, skilllevel) VALUES ($1, $2, $3)', [
          userId,
          activityName,
          skillLevel,
        ])
      );
      await Promise.all(activityQueries); // Run all queries in parallel for better performance
    }

    res.locals.success = `Account successfully created for ${email}`; // Return success message
    return next();
  } catch (err) {
    return next({ error: `${err.message} in usersController.signUp` });
  }
};

/**
 * Verifies user credentials for login by checking the provided email and password
 * - Looks up the user's hashed password in the database
 * - Uses bcrypt to compare the provided password with the stored hashed password
 * - Returns an error if the user is not found or if the password does not match
 */
usersController.verifyUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Look up the stored password for the given email
    const savedPasswordLookup = await db.query('SELECT password FROM users WHERE email=$1', [email]);

    if (savedPasswordLookup.rows.length === 0) {
      return next({ error: 'User not found' });
    }

    const savedPassword = savedPasswordLookup.rows[0].password;
    const passwordMatch = await bcrypt.compare(password, savedPassword); // Compare provided password with stored hash

    if (!passwordMatch) return next({ error: 'Password does not match' });
    return next();
  } catch (err) {
    return next({ error: `${err.message} in usersController.verifyUser` });
  }
};

/**
 * Retrieves all users from the `users` table
 * - If no users are found, returns an error
 * - Otherwise, stores the user data in `res.locals` for the next middleware
 */
usersController.getUsers = (req, res, next) => {
  db.query('SELECT * FROM users')
    .then((data) => {
      if (data.rows.length === 0) {
        return next({ error: 'No users found' });
      }
      res.locals.data = data.rows; // Store retrieved users data
      return next();
    })
    .catch((err) => next({ error: `${err.message} in usersController.getUsers` }));
};

/**
 * Retrieves users filtered by activity, skill level, and gender
 * - Joins `users` and `useractivities` tables to find users matching the criteria
 * - Stores the filtered users in `res.locals`
 */
usersController.getFilteredUsers = (req, res, next) => {
  const { activityName, skillLevel, gender } = req.query;

  db.query(
    'SELECT * FROM users JOIN useractivities USING(user_id) WHERE activityname=$1 AND skilllevel=$2 AND gender=$3',
    [activityName, skillLevel, gender]
  )
    .then((data) => {
      if (data.rows.length === 0) {
        return next({ error: 'No matching users found' });
      }
      res.locals.data = data.rows; // Store filtered user data
      return next();
    })
    .catch((err) => next({ error: `${err.message} in usersController.getFilteredUsers` }));
};

/**
 * Deletes a user from the `users` table by their email address
 * - Ensures the user exists before attempting deletion
 * - Returns the deleted user in `res.locals` if successful
 */
usersController.deleteUser = (req, res, next) => {
  const { email } = req.body;

  db.query('DELETE FROM users WHERE email = $1 RETURNING *', [email])
    .then((data) => {
      if (data.rows.length === 0) {
        return next({ error: 'User not found for deletion' });
      }
      res.locals.deleted = data.rows[0]; // Store deleted user information
      return next();
    })
    .catch((err) => next({ error: `${err.message} in usersController.deleteUser` }));
};

module.exports = usersController;

/**
 * Key improvements from the original:
 * 1. **Improved error consistency by using `next({ error: })` in all cases to standardize the handling of errors across the controller.
 * 2. **Improved performance by using `Promise.all()` to insert activities in parallel rather than sequentially.
 * 3. **Logging: Removed redundant console logs (logging the `activity` object) to reduce unnecessary outputs and improve code cleanliness.
 * 4. **Used `RETURNING *` in the delete query to ensure that the deleted user is returned and verified.
 * 5. **removed unnecessary conditions and comments.
 */
 