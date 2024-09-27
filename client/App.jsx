//importing React functionality - able to use JSX and React specific features like useState (Hook that lets you add state to functional components)
import React, { useState } from 'react';
// import Login, Signup, Main from their respective files
import Login from './component/login.jsx';
import Signup from './component/signup.jsx';
import Main from './component/main.jsx';
import { useSelector, useDispatch } from 'react-redux';

// Router allows you to navigate between different pages in a single-page application
import {
  BrowserRouter as Router,
  // Route defines a specific route in the app (/login, /signup)
  Route,
  // Container for all the route components
  Routes,
  // allows you to redirect users to another route ex. (/main to /user if user is not logged in)
  Navigate,
} from 'react-router-dom';
// importing css file that styles the components
import './style.css';
// exporting the App component which is the "main parent component"
export default function App() {
  // state hook definitions for each input value
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [firstName, setFirstName] = useState('');
  const [activity, setActivity] = useState('');
  const [skillLevel, setSkillLevel] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [distance, setDistance] = useState('');
  const [gender, setGender] = useState('');
  const [phone, setPhone] = useState('');
  const [allActivities] = useState(['Golf', 'Hiking', 'Camping', 'Biking']);
  const [selectedA, setSelectedA] = useState({});
  const [zipcodes, setZipcodes] = useState([]);
  // const [isLogin, setIsLogin] = useState(false);
  const isLogin = useSelector((state) => state.user.isLogin);
  // const [miles, setMiles] = useState(0);

  // loginState handler that updates the 'isLogin' variable to true everytime this function is invoked
  const loginState = () => {
    setIsLogin(true);
  };

  return (
    //Router handles all routes and allows the user to switch from path to path, whilst handling the browser history
    <>
      <Router>
        <Routes>
          {/* <nav></nav> */}
          <Route
            path='/login'
            element={
              <Login
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                loginState={loginState}
                confirmPw={confirmPw}
                setConfirmPw={setConfirmPw}
                firstName={firstName}
                setFirstName={setFirstName}
                activity={activity}
                setActivity={setActivity}
                skillLevel={skillLevel}
                setSkillLevel={setSkillLevel}
                city={city}
                setCity={setCity}
                zipCode={zipCode}
                setZipCode={setZipCode}
                gender={gender}
                setGender={setGender}
                phone={phone}
                setPhone={setPhone}
                allActivities={allActivities}
                selectedA={selectedA}
                setSelectedA={setSelectedA}
              />
            }
          />
          <Route
            path='/'
            element={
              <Login
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                loginState={loginState}
              />
            }
          />
          <Route
            path='/signup'
            element={
              <Signup
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                confirmPw={confirmPw}
                setConfirmPw={setConfirmPw}
                firstName={firstName}
                setFirstName={setFirstName}
                activity={activity}
                setActivity={setActivity}
                skillLevel={skillLevel}
                setSkillLevel={setSkillLevel}
                city={city}
                setCity={setCity}
                zipCode={zipCode}
                setZipCode={setZipCode}
                gender={gender}
                setGender={setGender}
                phone={phone}
                setPhone={setPhone}
                allActivities={allActivities}
                selectedA={selectedA}
                setSelectedA={setSelectedA}
              />
            }
          />
          <Route
            path='/main'
            element={
              isLogin ? (
                <Main
                  email={email}
                  setEmail={setEmail}
                  password={password}
                  setPassword={setPassword}
                  confirmPw={confirmPw}
                  setConfirmPw={setConfirmPw}
                  firstName={firstName}
                  setFirstName={setFirstName}
                  activity={activity}
                  setActivity={setActivity}
                  skillLevel={skillLevel}
                  setSkillLevel={setSkillLevel}
                  city={city}
                  setCity={setCity}
                  zipCode={zipCode}
                  setZipCode={setZipCode}
                  distance={distance}
                  setDistance={setDistance}
                  gender={gender}
                  setGender={setGender}
                  phone={phone}
                  setPhone={setPhone}
                  allActivities={allActivities}
                  selectedA={selectedA}
                  setSelectedA={setSelectedA}
                  zipcodes={zipcodes}
                  setZipcodes={setZipcodes}
                  // miles={miles}
                  // setMiles={setMiles}
                />
              ) : (
                <Navigate to='/login' />
              )
            }
          />
        </Routes>
      </Router>
    </>
  );
}
