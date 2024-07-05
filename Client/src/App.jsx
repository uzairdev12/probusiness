import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Toaster } from "sonner";
import "./index.css";

const App = () => {
  const navigate = useNavigate();
  const loggedin = localStorage.getItem("userID");
  const [pass, setPass] = useState(false);
  useEffect(() => {
    if (loggedin) {
      setPass(true);
    } else {
      navigate("/login");
      setPass(true);
    }
  }, []);

  return (
    <div>
      <Toaster richColors position="bottom-left" closeButton />
      {pass ? <Outlet /> : <h3>Loading...</h3>}
    </div>
  );
};

export default App;
