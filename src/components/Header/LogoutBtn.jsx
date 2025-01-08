import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { authService } from '../../appwrite'
import { logout } from '../../features/auth/authSlice'
import {Loading} from '../../components/index';

function LogoutBtn() {
   
    const dispatch=useDispatch()
    const logoutHandler =()=>{
          authService.logout().then(()=>{
            dispatch(logout()).catch((error)=>console.log(error.message))
          })
    }
   
  return (
    <button
    className='inline-bock px-6 py-2 duration-200 hover:bg-blue-100 rounded-full'
    onClick={logoutHandler}
    >Logout</button>
  )
}

export default LogoutBtn