import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter,RouterProvider, createBrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { Provider } from 'react-redux'
import store from './store/store.js'
import {Protected} from './components/index.js'
import {Home,AddPost,AllPosts,EditPost,Login,Post,Signup} from './pages/index.js'
import { useParams } from 'react-router-dom'


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
        {
            path: "/",
            element: <Home />,
        },
        {
            path: "/login",
            element: (
                <Protected authentication={false}>
                    <Login />
                </Protected>
            ),
        },
        {
            path: "/signup",
            element: (
                <Protected authentication={false}>
                    <Signup />
                </Protected>
            ),
        },
        {
            path: "/all-posts",
            element: (
                <Protected authentication>
                    {" "}
                    <AllPosts />
                </Protected>
            ),
        },
        {
            path: "/add-post",
            element: (
                <Protected authentication>
                    {" "}
                    <AddPost  />
                </Protected>
            ),
        },
        {
            path: "/edit-post/:slug",
            element: (
                <Protected  authentication>
                    {" "}
                    <EditPost />
                </Protected>
            ),
        },
        {
            path: "/post/:slug",
            element: <Post />,
        },
    ],
},
])

createRoot(document.getElementById('root')).render(

    <Provider store={store}>

       <RouterProvider router={router}/>

    </Provider>


)
