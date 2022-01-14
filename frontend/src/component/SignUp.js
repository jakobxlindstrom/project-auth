import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch, batch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { API_URL } from '../utils/constants'
import user from '../reducers/user'
import { StyledButton } from './StyledButton'

export const SignUp = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState('signin')
  const [isContainerActive, setIsContainerActive] = useState('')

  const accessToken = useSelector((store) => store.user.accessToken)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const onToggleClick = () => {
    if (mode === 'signin') {
      setMode('signup')
      setIsContainerActive(true)
    } else {
      setMode('signin')
      setIsContainerActive(false)
    }
  }

  useEffect(() => {
    if (accessToken) {
      navigate('/')
    }
  }, [accessToken, navigate])

  const onFormSubmit = (event) => {
    event.preventDefault()

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    }

    fetch(API_URL(mode), options)
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
        <form action='#' onSubmit={onFormSubmit}>
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
          <StyledButton>Sign Up</StyledButton>
        </form>
      </div>
      <div className='form-container sign-in-container'>
        {/* Sign in form */}
        <form action='#' onSubmit={onFormSubmit}>
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

          <StyledButton>Sign In</StyledButton>
        </form>
      </div>
      <div className='overlay-container'>
        <div className='overlay'>
          <div className='overlay-panel overlay-left'>
            <h1>Welcome Back!</h1>
            <p>
              To keep connected with us please login with your personal info
            </p>
            <StyledButton className='ghost' id='signIn' onClick={onToggleClick}>
              Sign In
            </StyledButton>
          </div>
          <div className='overlay-panel overlay-right'>
            <h1>Hello, Friend!</h1>
            <p>Enter your personal details and start journey with us</p>
            <StyledButton className='ghost' id='signUp' onClick={onToggleClick}>
              Sign Up
            </StyledButton>
          </div>
        </div>
      </div>
    </div>
  )
}
