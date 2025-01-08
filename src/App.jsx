import { useState, useEffect } from 'react'
import './App.css'
import { useDispatch } from 'react-redux'
import { Footer, Header, Loading } from './components'
import { service, authService } from './appwrite'
import { login, logout } from './features/auth/authSlice'
import { Outlet } from 'react-router-dom'


function App() {

  const [loading, setLoading] = useState(true)

  const dispatch = useDispatch()

  useEffect(() => {
    authService.getCurrentUser().then((userData) => {
      userData ? dispatch(login({ userData })) : dispatch(logout())
    }).finally(() => setLoading(false))
  }, [])

  return !loading ? (
    <div className='min-h-screen flex flex-wrap content-between bg-gray-400'>
      <div className='w-full block'>
        <Header />
        <main>
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  ) : (<Loading />)

}

export default App
