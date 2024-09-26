// required for using JSX and React components
import React from 'react';
// from the React library that allows you to navigate to different endpoints and establish links so that the page won't need to reload
import { Link, useNavigate } from 'react-router-dom';
// custom function that handles activity that is imported from another folder
import handleA from '../handleActivity';
// same as above but this one has the functionality to delete
import deleteA from '../deleteActivity';
// custom function that handles form submission and sends the user data over to the server
import handleSubmit from '../handleSubmit';
// importing state handler and the state updater that can interact with the store
import { useSelector, useDispatch } from 'react-redux';
// importing the necessary actions
import {
  setEmail,
  setPassword,
  setConfirmPw,
  setFirstName,
  setCity,
  setZipCode,
  setGender,
  setPhone,
  setUserData,
  login,
  logout,
} from '../redux/userSlice';
import {
  setActivity,
  setSkillLevel,
  addActivity,
  removeActivity,
  setZipcodes,
} from '../redux/activitySlice';

export default function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Accessing Redux state and storing it in this context in the const variable declared
  const email = useSelector((state) => state.user.email);
  const password = useSelector((state) => state.user.password);
  const confirmPw = useSelector((state) => state.user.confirmPw);
  const firstName = useSelector((state) => state.user.firstName);
  const city = useSelector((state) => state.user.city);
  const zipCode = useSelector((state) => state.user.zipCode);
  const gender = useSelector((state) => state.user.gender);
  const phone = useSelector((state) => state.user.phone);
  const selectedA = useSelector((state) => state.activity.selectedA);
  const allActivities = useSelector((state) => state.activity.allActivities);
  const skillLevel = useSelector((state) => state.user.skillLevel);
  const activity = useSelector((state) => state.activity.activity);

  // Filter available activities
  const availActivities = allActivities.filter(
    (a) => !selectedA.hasOwnProperty(a)
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login());
    navigate('/main');
  };

  return (
    <>
      <header id='header'></header>
      <form
        className='signupInfo'
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(
            e,
            '/signup',
            email,
            password,
            navigate,
            null,
            firstName,
            confirmPw,
            { activity: selectedA },
            city,
            zipCode,
            gender,
            phone
          );
        }}
      >
        {/* Email Input */}
        <label htmlFor='email'>Email: </label>
        <input
          id='email'
          className='allInput'
          value={email}
          type='email'
          required
          onChange={(e) => {
            dispatch(setEmail(e.target.value));
          }}
        />

        {/* Password Input */}
        <label htmlFor='password'>Password: </label>
        <input
          id='password'
          className='allInput'
          value={password}
          type='password'
          required
          onChange={(e) => {
            dispatch(setPassword(e.target.value));
          }}
        />

        {/* Confirm Password Input */}
        <label htmlFor='conPassword'>Confirm Password: </label>
        <input
          id='conPassword'
          className='allInput'
          value={confirmPw}
          type='password'
          required
          onChange={(e) => {
            dispatch(setConfirmPw(e.target.value));
          }}
        />

        {/* First Name Input */}
        <label htmlFor='firstName'>First Name: </label>
        <input
          id='firstName'
          className='allInput'
          value={firstName}
          type='text'
          required
          onChange={(e) => {
            dispatch(setFirstName(e.target.value));
          }}
        />

        {/* Activity Selector */}
        <label htmlFor='activity'>Choose an activity: </label>
        <select
          id='activity'
          className='allInput'
          value={activity}
          onChange={(e) => dispatch(setActivity(e.target.value))}
        >
          <option value=''></option>
          {availActivities.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>

        {/* Skill Level Radio Buttons */}
        <p>Choose skill level: </p>
        <div>
          <label>
            <input
              type='radio'
              name='skillLevel'
              checked={skillLevel === 'Beginner'}
              value='Beginner'
              onChange={(e) => {
                dispatch(setSkillLevel(e.target.value));
              }}
            />
            <span></span> Beginner
          </label>
          <label>
            <input
              type='radio'
              name='skillLevel'
              checked={skillLevel === 'Intermediate'}
              value='Intermediate'
              onChange={(e) => {
                dispatch(setSkillLevel(e.target.value));
              }}
            />
            <span></span> Intermediate
          </label>
          <label>
            <input
              type='radio'
              name='skillLevel'
              checked={skillLevel === 'Advanced'}
              value='Advanced'
              onChange={(e) => {
                dispatch(setSkillLevel(e.target.value));
              }}
            />
            <span></span> Advanced
          </label>
        </div>
        <br />

        {/* Add Activity Button */}
        <button
          type='button'
          onClick={(e) => {
            e.preventDefault(); // This prevents the default action of the button
            dispatch(
              addActivity({
                activity: activity,
                skillLevel: skillLevel,
              })
            );
          }}
        >
          ADD
        </button>

        {/* Selected Activities List */}
        <div id='listField'>
          <ul id='list'>
            {Object.entries(selectedA).map(([activity, skillLevel]) => (
              <li key={activity}>
                {activity} - {skillLevel}
                <button
                  type='button'
                  onClick={() => dispatch(removeActivity(activity))}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
        <br />

        {/* City Input */}
        <label htmlFor='city'>City: </label>
        <input
          id='city'
          className='allInput'
          value={city}
          type='text'
          required
          onChange={(e) => dispatch(setCity(e.target.value))}
        />

        {/* Zip Code Input */}
        <label htmlFor='zipcode'>Zip Code: </label>
        <input
          id='zipcode'
          className='allInput'
          value={zipCode}
          type='text'
          required
          onChange={(e) => dispatch(setZipCode(e.target.value))}
        />

        {/* Gender Selector */}
        <label htmlFor='gender'>Gender: </label>
        <select
          id='gender'
          className='allInput'
          value={gender}
          required
          onChange={(e) => dispatch(setGender(e.target.value))}
        >
          <option></option>
          <option label='Prefer not to say'>Prefer not to say</option>
          <option label='Non-binary'>Non-binary</option>
          <option label='Male'>Male</option>
          <option label='Female'>Female</option>
        </select>

        {/* Phone Number Input */}
        <label htmlFor='phone'>Phone Number: </label>
        <input
          id='phone'
          className='allInput'
          value={phone}
          type='text'
          required
          onChange={(e) => dispatch(setPhone(e.target.value))}
        />
        <br />

        {/* Buttons for navigation */}
        <div id='bottom'>
          <Link id='buttonButton' to='/login'>
            Login
          </Link>
          <button id='linkButton' type='submit'>
            Signup
          </button>
        </div>
      </form>
      <footer id='footer'></footer>
    </>
  );
}
