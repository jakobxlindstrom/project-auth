import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import { configureStore, combineReducers } from '@reduxjs/toolkit'

import { SignUp } from 'component/SignUp'
import { NotFound } from 'component/NotFound'
import { Access } from 'component/Access'
import '../src/index.css'
import user from 'reducers/user'
import info from 'reducers/info'

const reducer = combineReducers({
  user: user.reducer,
  info: info.reducer,
})

const store = configureStore({ reducer })

export const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Access />} />
          <Route path='/signin' element={<SignUp />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  )
}
