const db = require('../../db/models/usersModel');
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
        'INSERT INTO useractivities (user_id, activityname, skilllevel) VALUES ($1, $2, $3)',
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

  try {
    const savedPasswordLookup = await db.query(
      'SELECT password FROM users WHERE email=$1',
      [email]
    );

    if (savedPasswordLookup.rows.length === 0) {
      return next({ err: 'User not found' });
    }

    const savedPassword = savedPasswordLookup.rows[0].password;

    const passwordMatch = await bcrypt.compare(password, savedPassword);
    if (!passwordMatch) return next({ err: 'Password does not match' });
    return next();
  } catch (err) {
    return next({ error: `${err} in verifyUser middleware` });
  }
};

//   const SQLQuery = 'SELECT password FROM users WHERE email = $1';
//   db.query(SQLQuery, [email])
//     // .then((response) => response.json()) //may not need to convert from json
//     .then((data) => {
//       if (data.password === hashedPassword) {
//         return next();
//       } else {
//         const defaultErr = {
//           log: 'Error occured in usersController.verifyUser middleware',
//           status: 401,
//           message: { err: 'Incorrect email or password' },
//         };
//         return next(defaultErr);
//       }
//     })
//     .catch(
//       next({
//         log: 'Error occured in usersController.verifyUser middlewear',
//         status: 401,
//         message: { err: 'error in email/pw verification' },
//       })
//     );
// };

//gets users within a certain radius of a zip coded

// usersController.getUsersWithinRadius = async (req, res, next) => {
//   const { zipCode, radius } = req.query;
//   if (!zipCode || !radius) {
//     return next({
//       error: 'Zip Code and Radius are required',
//     });
//   }

//   //convert zip code to long and lat
//   try {

//     // AIzaSyD-PDkwpDiPMXBbVIHKVtOT2pIjT9xyJ0U

//     // var lat = '';
//     // var lng = '';
//     // var address = {zipcode} or {city and state};
//     // geocoder.geocode( { 'address': address}, function(results, status) {
//     //   if (status == google.maps.GeocoderStatus.OK) {
//     //      lat = results[0].geometry.location.lat();
//     //      lng = results[0].geometry.location.lng();
//     //     });
//     //   } else {
//     //     alert("Geocode was not successful for the following reason: " + status);
//     //   }
//     // });
//     // alert('Latitude: ' + lat + ' Logitude: ' + lng);
//     // const { latitude, longitude } = await geocoder.geocode(zipCode);

//     //Haversine formula (WE NEED TO GO BACK AND CONVERT USERS ZIPCODE TO LONGITUTDE & LATITUDE VALUES WHEN THEY SIGN UP AND STORE IN TABLE)
//     const query = `
//       SELECT firstname, email, city, zipcode, gender, phone,
//         (6371 * acos(cos(radians($1)) * cos(radians(latitude)) *
//         cos(radians(longitude) - radians($2)) +
//         sin(radians($1)) * sin(radians(latitude)))) AS distance
//       FROM users
//       HAVING distance <= $3
//       ORDER BY distance;
//     `;

//     const results = await db.query(query, [latitude, longitude, radius]);
//     res.locals.results = results.json(results.rows);
//     return next();
//   } catch (err) {
//     console.error(err);
//     return next({
//       error: `${err.message} in usersController.getUsersWithinRadius`,
//     });
//   }
// };

//finds user by email address
usersController.getUsers = (req, res, next) => {
  const { email } = req.body;
  const SQLQuery = 'SELECT * FROM users';

  db.query(SQLQuery)
    .then((data) => {
      console.log('rows:', data.rows);
      if (!data.rows[0]) {
        return next({
          log: 'user not found in getUsersFunction',
          status: 404,
          message: 'user not found',
        });
      }
      res.locals.data = data;
      return next();
    })
    .catch((err) => next(err));
};

usersController.getFilteredUsers = (req, res, next) => {
  const { activityName, skillLevel, gender } = req.query;
  console.log('activity name:' + activityName);
  // console.log('');
  console.log('REQ PARAMS=' + req.query);
  const filteredQuery =
    'SELECT * FROM users JOIN useractivities USING(user_id) WHERE activityname=$1 AND skilllevel=$2 AND gender=$3';
  db.query(filteredQuery, [activityName, skillLevel, gender])
    .then((data) => {
      console.log('DATA:', data.rows);
      res.locals.data = data.rows;
      return next();
    })
    .catch((err) => next(err));
};

//AS: deletes a user based on email address
usersController.deleteUser = (req, res, next) => {
  const { email } = req.body;
  const SQLQuery = 'DELETE FROM users WHERE email = $1';
  db.query(SQLQuery, [email])
    .then((data) => {
      console.log('deleted:', data.rows);
      res.locals.deleted = data.rows;
      return next();
    })
    .catch((err) => next(err));
};

module.exports = usersController;
//http://localhost:3000/main?activityname=Golf&skilllevel=Intermediate&gender=Male
