import React, { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import "./index.css";

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const loggedin = localStorage.getItem("userID");
  const [pass, setPass] = useState(false);

  useEffect(() => {
    // Check if the user is on /login or /login/:id
    const isLoginPage = location.pathname.startsWith("/login");

    if (!isLoginPage) {
      if (loggedin) {
        setPass(true);
      } else {
        // Store the current location
        navigate("/login", { state: { from: location } });
        setPass(true);
      }
    } else {
      setPass(true);
    }
  }, [loggedin, location, navigate]);

  return (
    <div>
      <Toaster richColors position="bottom-left" closeButton />
      {pass ? <Outlet /> : <h3>Loading...</h3>}
    </div>
  );
};

export default App;
