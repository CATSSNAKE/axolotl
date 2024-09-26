//necessary to use JSX functions
import React from 'react';
// links routes and allows navigation without having the reload the html page
// useNavigate redirects users to an inputted route
import { Link, useNavigate } from 'react-router-dom';
// a custom function that is defined in another file
import handleSubmit from '../handleSubmit';
// exporting default Login component constructor
export default function Login({
  //these are the destructured props which has the variable and the function that updates the state of the variable
  email,
  setEmail,
  password,
  setPassword,
  loginState,
  confirmPw,
  setConfirmPw,
  setFirstName,
  setActivity,
  setSkillLevel,
  city,
  setCity,
  zipCode,
  setZipCode,
  gender,
  setGender,
  phone,
  setPhone,
  selectedA,
  setSelectedA,
  setZipcodes,
}) {
  // variable store of useNavigate functionality
  const navigate = useNavigate();
  return (
    //JSX structure that includes a header and a form
    // the form element triggers login functionality
    // upon clicking the submit button, it will first prevent the page from refreshing
    // it will then call the handleSubmit function and pass several arguments into it (form data, navigate functionality, etc)
    <>
      <header id='header'></header>
      <form
        className='loginInfo'
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(
            e,
            '/login',
            email,
            password,
            navigate,
            loginState,
            confirmPw,
            {
              activity: selectedA,
            },
            city,
            zipCode,
            gender,
            phone,
            setZipcodes,
            setEmail,
            setPassword,
            setConfirmPw,
            setFirstName,
            setActivity,
            setSkillLevel,
            setCity,
            setZipCode,
            setGender,
            setPhone,
            setSelectedA
          );
        }}
      >
        <label htmlFor='email'>Email: </label>
        <input
          id='email'
          className='allInput'
          value={email}
          type='email'
          required
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <label htmlFor='password'>Password: </label>
        <input
          id='password'
          className='allInput'
          value={password}
          type='password'
          required
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <br></br>
        <div id='bottom'>
          <button id='linkButton'>Login</button>
          <Link id='buttonButton' to='/signup'>
            Signup
          </Link>
        </div>
      </form>
      <footer id='footer'></footer>
    </>
  );
}
//label is the text label for the corresponding input fields
// the input elements are present for the email and password
// both have state change functions that will update the state as soon as something is typed in
//the last div is a login button which will trigger the handle submit function onSubmit
// there is also a link to the signup endpoint which will render the signup form
