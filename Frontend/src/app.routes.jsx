import {createBrowserRouter, Navigate} from "react-router"
import Register from "./features/auth/pages/Register"
import Login from "./features/auth/pages/Login"
import Protected from "./features/auth/components/Protected"
import Layout from "./features/home/components/Layout/Layout"
import Home from "./features/home/pages/Home"
import MyMusic from "./features/home/pages/MyMusic"
import Trending from "./features/home/pages/Trending"
import Subscription from "./features/home/pages/Subscription"

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Protected><Layout/></Protected>,
        children: [
            { index: true, element: <Navigate to="/home" replace /> },
            { path: "home", element: <Home /> },
            { path: "my-music", element: <MyMusic /> },
            { path: "trending", element: <Trending /> },
            { path: "subscription", element: <Subscription /> },
        ]
    },
    {
        path: "/register",
        element: <Register/>
    },
    {
        path: "/login",
        element: <Login/>
    }
])