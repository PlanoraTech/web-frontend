import React from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import { Home } from './components/Home'
import { UserPage } from './components/UserUI/UserPage'
import { Login } from './components/UserUI/Login'
import { Profile } from './components/UserUI/Profile'

const router = createBrowserRouter([
    {
        path: "/",
        element: <>
            <h1>Go to the <a href='/home'>homepage</a></h1>
        </>,
    },
    {
        path: "/home",
        element: <Home />,
    },
    {
        path: "/timetables",
        element: <UserPage />,
    },
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/profile",
        element: <Profile />,
    }
]);

createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>,
)
