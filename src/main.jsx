import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import App from "./App";
import Login from "./Pages/Login";
import Dashboard from "./Pages/Dashboard";
import Deposit from "./Pages/Deposit";
import Withdraw from "./Pages/Withdraw";
import Trees from "./Pages/Trees";
import Admin from "./Pages/Admin";
import Deposits from "./Pages/Deposits";
import Withdraws from "./Pages/Withdraws";
import ChangeValues from "./Pages/ChangeValues";
import Users from "./Pages/Users";
import EditUser from "./Pages/EditUser";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Dashboard />,
      },
      {
        path: "/login",
        element: <Login />,
        children: [
          {
            path: "/login/:id",
            element: <Login />,
          },
        ],
      },
      {
        path: "/deposit",
        element: <Deposit />,
      },
      {
        path: "/manageusersfortheprobusiness",
        element: <Users />,
      },
      {
        path: "/withdraw",
        element: <Withdraw />,
      },
      {
        path: "/trees",
        element: <Trees />,
      },
      {
        path: "/admindashboard",
        element: <Admin />,
      },
      {
        path: "/admindashboard/deposits",
        element: <Deposits />,
      },
      {
        path: "/admindashboard/withdraws",
        element: <Withdraws />,
      },
      {
        path: "/admindashboard/changevalues",
        element: <ChangeValues />,
      },
      {
        path: "/edituser/:id",
        element: <EditUser />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
