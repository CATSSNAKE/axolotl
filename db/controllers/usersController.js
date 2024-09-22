const db = require('../models/usersModel');
const bcrypt = require('bcrypt');

const usersController = {};

usersController.signUp = async (req, res, next) => {
  const { email, password, firstName, activity, city, zipCode, gender, phone } =
    req.body;
  if (!email || !password) {
    throw new Error('Email and Password required!');
  }
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  try {
    const doesUserEmailExist = await db.query(
      'SELECT * FROM users WHERE email=$1',
      [email]
    );
    if (doesUserEmailExist.rows.length > 0) {
      throw new Error('Account for email already exists');
    }
    const result = await db.query(
      'INSERT INTO users (firstname, email, password, city, zipcode, gender, phone) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [firstName, email, hashedPassword, city, zipCode, gender, phone]
    );

    const userResult = await db.query(
      'SELECT user_id FROM users WHERE email = $1',
      [email]
    );
    const userId = userResult.rows[0].user_id;

    console.log(activity);

    for (const [activityName, skillLevel] of Object.entries(activity)) {
      await db.query(
        'INSERT INTO useractivities (userid, skilllevel, activityname) VALUES ($1, $2, $3)',
        [userId, activityName, skillLevel]
      );
    }
    res.locals.success = `Account successfully created for ${email}`;
    return next();
  } catch (err) {
    console.log(err);
    return next({ error: `${err} in usersController.signup` });
  }
};

usersController.verifyUser = async (req, res, next) => {
  console.log('verifying');
  const { email, password } = req.body;

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const SQLQuery = 'SELECT password FROM users WHERE email = $1';
  db.query(SQLQuery, [email])
    // .then((response) => response.json()) //may not need to convert from json
    .then((data) => {
      if (data.password === hashedPassword) {
        return next();
      } else {
        const defaultErr = {
          log: 'Error occured in usersController.verifyUser middlewear',
          status: 401,
          message: { err: 'Incorrect email or password' },
        };
        return next(defaultErr);
      }
    })
    .catch(
      next({
        log: 'Error occured in usersController.verifyUser middlewear',
        status: 401,
        message: { err: 'error in email/pw verification' },
      })
    );
};

usersController.getUsers = (req, res, next) => {
  const SQLQuery = 'SELECT * FROM users';
  db.query(SQLQuery)
    .then((data) => {
      console.log(data.rows);
      res.locals.data = data.rows;
      return next();
    })
    .catch((err) => next(err));
};

module.exports = usersController;
