import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import store from '../store/store'
import {Loading} from './index'

export default function Protected({ children, authentication = true }) {
  const navigate = useNavigate()
  const [loader, setLoader] = useState('true')
  const authStatus = useSelector((state) => state.status)

  useEffect(() => {

    if (authentication && authStatus !== authentication) {
      navigate('/login')
    } else if (!authentication && authStatus !== authentication) {
      navigate('/')
    }

    setLoader(false)

  }, [authStatus, navigate, authentication])

  return loader ? (<Loading />) : <>{children}</>
}

