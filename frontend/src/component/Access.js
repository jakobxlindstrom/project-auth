import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'

import { API_URL } from '../utils/constants'

export const Access = () => {
  const accessToken = useSelector((store) => store.user.accessToken)

  const options = {
    method: 'GET',
    headers: {
      Authorization: a,
    },
  }

  useEffect(() => {
    fetch(API_URL('/home'))
  }, [])

  return (
    <div>
      <h1>Your profile</h1>
    </div>
  )
}
