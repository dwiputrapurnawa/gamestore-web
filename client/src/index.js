import React from 'react';
import ReactDOM from 'react-dom/client';
import App from "./components/App";
import Login from "./components/Login";
import Store from './components/Store';
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Register from './components/Register';
import Dashboard from './components/Dashboard';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/register",
    element: <Register />
  },
  {
    path: "/store",
    element: <Store />
  },
  {
    path: "/admin/dashboard",
    element: <Dashboard />
  }
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <RouterProvider router={router} />
);
