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

export default function Signup({
  email, // const email = useSelector(state => state.auth.user.email)
  setEmail, // create a reducer in your auth state (ie. updateEmail), and then call dispatch(updateEmail('tim@yahoo.com')) where needed
  password,
  setPassword,
  confirmPw,
  setConfirmPw,
  firstName,
  setFirstName,
  activity,
  setActivity,
  skillLevel,
  setSkillLevel,
  city,
  setCity,
  zipCode,
  setZipCode,
  gender,
  setGender,
  phone,
  setPhone,
  allActivities,
  selectedA,
  setSelectedA,
  setZipcodes,
}) {
  // change the user route
  const navigate = useNavigate();
  // take out the activities that weren't selected by checking if they aren't in the selectedA object
  const availActivities = allActivities.filter(
    (a) => !selectedA.hasOwnProperty(a)
  );
  //form handles user input for the signup
  // onSubmit invokes the handleSubmit function which passes in user data as arguments to the server
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
        {/* same setup and logic for each user input field - state will be updated as soon as the user starts typing and the final state values will be passed into the handleSubmit function above */}
        <label htmlFor='email'>Email: </label>
        <input
          id='email'
          className='allInput'
          value={email}
          type='email'
          required
          onChange={(e) => {
            setEmail(e.target.value);
            dispatch(updateEmail(e.t))
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
        <label htmlFor='conPassword'>Confirm Password: </label>
        <input
          id='conPassword'
          className='allInput'
          value={confirmPw}
          type='password'
          required
          onChange={(e) => {
            setConfirmPw(e.target.value);
          }}
        />
        <label htmlFor='firstName'>First Name: </label>
        <input
          id='firstName'
          className='allInput'
          value={firstName}
          type='text'
          required
          onChange={(e) => {
            setFirstName(e.target.value);
          }}
        />
        {/* activity is a dropdown selector and the state of the activity is also updated onChange */}
        {/* activities dropdown will show the activites that haven't been selected yet */}
        <label htmlFor='activity'>Choose an activity: </label>
        <select
          id='activity'
          className='allInput'
          value={activity}
          onChange={(e) => setActivity(e.target.value)}
        >
          <option value=''></option>
          {availActivities.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
        {/* three different skill selectors that are in the radio button format that will update the SkillLevel in the state onChange */}
        skill level selection
        <p>Choose skill level: </p>
        <div>
          <label>
            <input
              type='radio'
              name='skillLevel'
              checked={skillLevel === 'Beginner'}
              value='Beginner'
              onChange={(e) => setSkillLevel(e.target.value)}
            ></input>
            <span></span> Beginner
          </label>
          <label>
            <input
              type='radio'
              name='skillLevel'
              checked={skillLevel === 'Intermediate'}
              value='Intermediate'
              onChange={(e) => setSkillLevel(e.target.value)}
            ></input>
            <span></span> Intermediate
          </label>
          <label>
            <input
              type='radio'
              name='skillLevel'
              checked={skillLevel === 'Advanced'}
              value='Advanced'
              onChange={(e) => setSkillLevel(e.target.value)}
            ></input>
            <span></span> Advanced
          </label>
        </div>
        <br></br>
        {/* When this button is clicked it will pass in the current state of the selected activity and skill level into the handleA state */}
        <button
          type='button'
          onClick={() =>
            handleA(
              activity,
              setActivity,
              selectedA,
              setSelectedA,
              skillLevel,
              setSkillLevel
            )
          }
        >
          ADD
        </button>
        {/* it is an unordered list that will create list items of the activity and the skill level with a button that lets you delete this specific activity onClick by calling the delete Activity function*/}
        <div id='listField'>
          <ul id='list'>
            {Object.entries(selectedA).map(([activity, skillLevel]) => (
              <li key={activity}>
                {activity} - {skillLevel}
                <button
                  type='button'
                  onClick={() => deleteA(activity, setSelectedA)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
        <br></br>
        {/* same logic as above*/}
        <label htmlFor='city'>City: </label>
        <input
          id='city'
          className='allInput'
          value={city}
          type='text'
          required
          onChange={(e) => {
            setCity(e.target.value);
          }}
        />
        {/* same logic as above*/}
        <label htmlFor='zipcode'>Zip Code: </label>
        <input
          id='zipcode'
          className='allInput'
          value={zipCode}
          type='text'
          required
          onChange={(e) => {
            setZipCode(e.target.value);
          }}
        />
        {/* dropdown list that has same logic as above */}
        <label htmlFor='gender'>Gender: </label>
        <select
          id='gender'
          className='allInput'
          value={gender}
          required
          onChange={(e) => {
            setGender(e.target.value);
          }}
        >
          <option></option>
          <option label='Prefer not to say'>Prefer not to say</option>
          <option label='Non-binary'>Non-binary</option>
          <option label='Male'>Male</option>
          <option label='Female'>Female</option>
        </select>
        {/* get cell# */}
        <label htmlFor='phone'>Phone Number: </label>
        <input
          id='phone'
          className='allInput'
          value={phone}
          type='text'
          required
          onChange={(e) => {
            setPhone(e.target.value);
          }}
        />
        <br></br>
        {/* buttons that will redirect to login endpoint or will trigger the onSubmit event above */}
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
