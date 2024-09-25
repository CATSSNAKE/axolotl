const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const PORT = 3000;
const cookieController = require('./controllers/cookieController.js');
//import usersController
const userCont = require('./controllers/usersController.js');

// parses JSON from incoming request
app.use(cors());
app.use(express.json());

//handler for post at login
//AS: added middleware for creating cookie upon login - haven't tested yet
app.post(
  '/login',
  userCont.verifyUser,
  cookieController.setCookie,
  (req, res) => {
    console.log('logged in!');
    //AS: sending string back to front if user is verified
    return res.status(200).json({ string: 'password matched for this user' });
  }
);

//test get
//AS: this set cookie middleware is currently working for this get request
app.get(
  '/main',
  userCont.getFilteredUsers,
  cookieController.setCookie,
  (req, res) => {
    console.log('DATA2:' + res.locals.data);
    console.log('First person:' + res.locals.data[0].firstname);
    return res.status(200).json(res.locals.data);
  }
);

//handle post

//handle post request for sign up
//AS: not sure if we acutally need to create a cookie when they sign up.. probably just when they sign in?
app.post('/signup', userCont.signUp, cookieController.setCookie, (req, res) => {
  console.log('signed up!');
  return res.status(200).json(res.locals.success);
});

// app.post('/main', (req, res) => {
//   res.status(200).json({ message: 'search criteria has been recevied' });
// });

//handles a post request form main that sends a ticket to the data base

//handles a get request from main that sends any existing tickets to the feed

//AS: ADDED DELETE ROUTE HANDLER
app.delete('/delete', userCont.deleteUser, (req, res) => {
  console.log('deleted!');
  return res.status(200).json(res.locals.deleted);
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.log('err');
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: { err: 'An error occurred' },
  };
  const errorObj = Object.assign({}, defaultErr, err);
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});

const server = app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}...`);
});

module.exports = { app, server };
