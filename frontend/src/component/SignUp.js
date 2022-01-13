import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch, batch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { API_URL } from '../utils/constants'
import user from '../reducers/user'

export const SignUp = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  // const [mode, setMode] = useState('')
  const [isContainerActive, setIsContainerActive] = useState('')

  const accessToken = useSelector((store) => store.user.accessToken)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    if (accessToken) {
      navigate('/')
    }
  }, [accessToken, navigate])

  const onSignUpSubmit = (event) => {
    event.preventDefault()

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    }

    fetch(API_URL('signup'), options)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          batch(() => {
            dispatch(user.actions.setUserId(data.response.userId))
            dispatch(user.actions.setUsername(data.response.username))
            dispatch(user.actions.setAccessToken(data.response.accessToken))
            dispatch(user.actions.setError(null))
          })
        } else {
          dispatch(user.actions.setUserId(null))
          dispatch(user.actions.setUsername(null))
          dispatch(user.actions.setAccessToken(null))
          dispatch(user.actions.setError(data.response))
        }
      })
  }

  const onSignInSubmit = (event) => {
    event.preventDefault()

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    }

    fetch(API_URL('signin'), options)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          batch(() => {
            dispatch(user.actions.setUserId(data.response.userId))
            dispatch(user.actions.setUsername(data.response.username))
            dispatch(user.actions.setAccessToken(data.response.accessToken))
            dispatch(user.actions.setError(null))
          })
        } else {
          dispatch(user.actions.setUserId(null))
          dispatch(user.actions.setUsername(null))
          dispatch(user.actions.setAccessToken(null))
          dispatch(user.actions.setError(data.response))
        }
      })
  }

  return (
    <div
      className={`container ${isContainerActive ? 'right-panel-active' : ''}`}
    >
      <div className='form-container sign-up-container'>
        {/* Sign up form */}
        <form action='#' onSubmit={onSignUpSubmit}>
          <h1>Create Account</h1>
          <div className='social-container'></div>
          <span>or use your email for registration</span>
          <input
            type='text'
            value={username}
            placeholder='Username'
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type='password'
            value={password}
            placeholder='Password'
            onChange={(e) => setPassword(e.target.value)}
          />
          <button>Sign Up</button>
        </form>
      </div>
      <div className='form-container sign-in-container'>
        {/* Sign in form */}
        <form action='#' onSubmit={onSignInSubmit}>
          <h1>Sign in</h1>
          <div className='social-container'></div>
          <span>or use your account</span>
          <input
            id='username'
            type='text'
            value={username}
            placeholder='Username'
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            id='password'
            type='password'
            value={password}
            placeholder='Password'
            onChange={(e) => setPassword(e.target.value)}
          />
          {/* <a href='#'>Forgot your password?</a> */}
          <button>Sign In</button>
        </form>
      </div>
      <div className='overlay-container'>
        <div className='overlay'>
          <div className='overlay-panel overlay-left'>
            <h1>Welcome Back!</h1>
            <p>
              To keep connected with us please login with your personal info
            </p>
            <button
              className='ghost'
              id='signIn'
              onClick={() => setIsContainerActive(false)}
            >
              Sign In
            </button>
          </div>
          <div className='overlay-panel overlay-right'>
            <h1>Hello, Friend!</h1>
            <p>Enter your personal details and start journey with us</p>
            <button
              className='ghost'
              id='signUp'
              onClick={() => setIsContainerActive(true)}
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
