import React from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import { Home } from './components/Home'
import { UserPage } from './components/UserUI/UserPage'
import { Login } from './components/UserUI/Login'
import { Profile } from './components/UserUI/Profile'
import { ThemeProvider } from './ThemeContext'
import { Menu } from './components/DirectorUI/Menu'
import { Main } from './components/Main'

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
        // element: <UserPage />,
        element: <Main type='main' />,
    },
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/profile",
        element: <Profile />,
    },
    {
        path: "/manage",
        // element: <Menu />,
        element: <Main type='manage' />,
    }
]);

createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ThemeProvider>
            <RouterProvider router={router} />
        </ThemeProvider>
    </React.StrictMode>,
)
