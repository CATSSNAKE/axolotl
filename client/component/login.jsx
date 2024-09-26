import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import {
  setEmail,
  setPassword,
  login,
  logout,
  setUserData,
} from '../redux/userSlice';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const email = useSelector((state) => state.user.email);
  const password = useSelector((state) => state.user.password);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login());
    navigate('/main');
  };
  return (
    <>
      <header id='header'></header>
      <form className='loginInfo' onSubmit={handleSubmit}>
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
        <br></br>
        <div id='bottom'>
          <button id='linkButton' type='submit'>
            Login
          </button>
          <Link id='buttonButton' to='/signup'>
            Signup
          </Link>
        </div>
      </form>
      <footer id='footer'></footer>
    </>
  );
}
