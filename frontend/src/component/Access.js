import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch, batch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import user from 'reducers/user'
import { API_URL } from '../utils/constants'
import styled from 'styled-components'

import { StyledButton } from './StyledButton'

const ProfileCard = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
  position: relative;
  overflow: hidden;
  width: 768px;
  max-width: 100%;
  min-height: 480px;
`

export const Access = () => {
  const [profileImg, setProfileImg] = useState('')
  const accessToken = useSelector((store) => store.user.accessToken)
  const username = useSelector((store) => store.user.username)
  const profilePic = useSelector((store) => store.user.profilePic)
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

  const onProfilePicUpload = (event) => {
    event.preventDefault()

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      // body: JSON.stringify({ profilePic }),
    }

    fetch(API_URL('home'), options)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          batch(() => {
            dispatch(user.actions.setProfilePic(data.response.profilePic))
            // dispatch(user.actions.setError(null))
          })
        } else {
          dispatch(user.actions.setError(data.response))
        }
      })
  }

  return (
    <ProfileCard>
      <img
        src="data:image/<%=image.img.contentType%>;base64,
                     <%=image.img.data.toString('base64')%>"
      />
      <h1>Hi {username} this is your profile page</h1>

      <form onSubmit={onProfilePicUpload}>
        <label htmlFor='image'>Upload Image</label>
        <input
          type='file'
          id='image'
          name='image'
          value={profileImg}
          onChange={(e) => setProfileImg(e.target.value)}
        />
        <button>Upload</button>
      </form>
      <StyledButton onClick={onRemoveToken}>Sign out</StyledButton>
    </ProfileCard>
  )
}
