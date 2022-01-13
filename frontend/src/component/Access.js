import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import user from 'reducers/user'
import { API_URL } from '../utils/constants'

export const Access = () => {
  const accessToken = useSelector((store) => store.user.accessToken)
  const username = useSelector((store) => store.user.username)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const onRemoveToken = () => {
    dispatch(user.actions.setDeleteAccessToken())
    // navigate('/')
  }

  useEffect(() => {
    if (!accessToken) {
      navigate('/signin')
    }
  }, [accessToken, navigate])

  useEffect(() => {
    const options = {
      method: 'GET',
      headers: {
        Authorization: accessToken,
        'Content-Type': 'application/json',
      },
    }

    fetch(API_URL('home'), options)
      .then((response) => response.json())
      .then((data) => console.log(data))
  }, [accessToken])

  return (
    <div className='profile-card'>
      <h1>Hi {username} this is your profile page</h1>
      <button onClick={onRemoveToken}>Sign out</button>
    </div>
  )
}
