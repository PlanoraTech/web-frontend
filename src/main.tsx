import React from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import './index.css'
import { Home } from './components/Home'
import { Login } from './components/Login'
import { Profile } from './components/Profile'
import { ThemeProvider } from './ThemeContext'
import { Main } from './components/Main'

const router = createBrowserRouter([
    {
        path: "/",
        element: <Navigate to="/home" replace />,
    },
    {
        path: "/home",
        element: <Home />,
    },
    {
        path: "/timetables",
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
        element: <Main type='manage' />,
    },
    {
        path: "*",
        element: <Navigate to="/home" replace />,
    },
]);

createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ThemeProvider>
            <RouterProvider router={router} />
        </ThemeProvider>
    </React.StrictMode>,
)
