import React, { useEffect, useState } from "react";
import "./login.css";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { TailSpin } from "react-loader-spinner";

const LoginPage = () => {
  const navigate = useNavigate();
  const [active, setActive] = useState(true);
  const [loading, setLoading] = useState(false);

  const loggedin = localStorage.getItem("userID");
  useEffect(() => {
    if (loggedin) {
      navigate("/");
    }
  });
  if (loggedin) {
    navigate("/");
  }
  const { id } = useParams();
  const [active2, setActive2] = useState(false);
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  console.log(id);

  const signup = async () => {
    try {
      if (data.password !== data.confirmPassword) {
        toast.error("Passwords do not match");
        return;
      } else if (data.password.length < 6) {
        toast.error("Password must be at least 6 characters");
        return;
      }
      setLoading(true);
      const data2 = await fetch(
        "https://probusinessapi.vercel.app/api/auth/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ data, reffer: id }),
        }
      );
      const data3 = await data2.json();
      if (data3.success) {
        toast.success("Signup Successful");
        localStorage.setItem("userID", data3.user._id);
        setLoading(false);
        navigate("/");
      } else {
        toast.error(data3.message);
        setLoading(false);
      }
    } catch (e) {
      toast.error(e.message);
      setLoading(false);
    }
  };
  const login = async () => {
    try {
      setLoading(true);
      const data2 = await fetch(
        "https://probusinessapi.vercel.app/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      const data3 = await data2.json();
      if (data3.success) {
        toast.success("Login Successful");
        localStorage.setItem("userID", data3.user._id);
        setLoading(false);
        navigate("/");
      } else {
        toast.error(data3.message);
        setLoading(false);
      }
    } catch (e) {
      toast.error(e.message);
      setLoading(false);
    }
  };
  return (
    <div className="loginPage">
      <div className={active ? "container" : "container active"} id="container">
        <div className="form-container sign-up">
          <form>
            <h1>Sign up</h1>
            <span>Create an Account</span>
            <input
              type="text"
              placeholder="Name"
              value={data.name}
              onChange={(e) => setData({ ...data, name: e.target.value })}
            />

            <input
              type="text"
              placeholder="Email"
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
            />

            <input
              type="password"
              placeholder="Password"
              value={data.password}
              onChange={(e) => setData({ ...data, password: e.target.value })}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={data.confirmPassword}
              onChange={(e) =>
                setData({ ...data, confirmPassword: e.target.value })
              }
            />

            <button
              onClick={(e) => {
                e.preventDefault();
                signup();
              }}
            >
              {loading ? (
                <TailSpin
                  visible={true}
                  height="20"
                  width="20"
                  color="#ffff"
                  ariaLabel="tail-spin-loading"
                  radius="1"
                  wrapperStyle={{}}
                  wrapperClass=""
                />
              ) : (
                "Signup"
              )}
            </button>
          </form>
        </div>
        <div className="form-container sign-in">
          <form>
            <h1>{active2 ? "Sign up" : "Log In"}</h1>

            <span>
              {active2 ? "Create an Account" : "Enter your email and password"}
            </span>
            {active2 ? (
              <>
                <input
                  type="text"
                  placeholder="Name"
                  value={data.name}
                  onChange={(e) => setData({ ...data, name: e.target.value })}
                />

                <input
                  type="text"
                  placeholder="Email"
                  value={data.email}
                  onChange={(e) => setData({ ...data, email: e.target.value })}
                />

                <input
                  type="password"
                  placeholder="Password"
                  value={data.password}
                  onChange={(e) =>
                    setData({ ...data, password: e.target.value })
                  }
                />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={data.confirmPassword}
                  onChange={(e) =>
                    setData({ ...data, confirmPassword: e.target.value })
                  }
                />
              </>
            ) : (
              <>
                <input
                  type="text"
                  placeholder="Email"
                  value={data.email}
                  onChange={(e) => setData({ ...data, email: e.target.value })}
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={data.password}
                  onChange={(e) =>
                    setData({ ...data, password: e.target.value })
                  }
                />
              </>
            )}

            <button
              onClick={(e) => {
                e.preventDefault();
                {
                  active2 ? signup() : login();
                }
              }}
            >
              {loading ? (
                <TailSpin
                  visible={true}
                  height="20"
                  width="20"
                  color="#ffff"
                  ariaLabel="tail-spin-loading"
                  radius="1"
                  wrapperStyle={{}}
                  wrapperClass=""
                />
              ) : active2 ? (
                "Sign Up"
              ) : (
                "Log In"
              )}
            </button>
            {active2 ? (
              <p className="ratherText">
                Already have an account?{" "}
                <a
                  onClick={() => setActive2(false)}
                  style={{
                    textDecoration: "underline",
                    color: "blue",
                    cursor: "pointer",
                  }}
                >
                  Log in
                </a>
              </p>
            ) : (
              <p className="ratherText">
                Don't have an account?{" "}
                <a
                  onClick={() => setActive2(true)}
                  style={{
                    textDecoration: "underline",
                    color: "blue",
                    cursor: "pointer",
                  }}
                >
                  Sign Up
                </a>
              </p>
            )}
          </form>
        </div>
        <div className="toggle-container">
          <div className="toggle">
            <div className="toggle-panel toggle-left">
              <h1>Hello, Friend!</h1>
              <p>
                Sign up to access all the features of ProBusiness's learning and
                earning services.
              </p>
              <button
                className="hidden"
                id="login"
                onClick={() => setActive(true)}
              >
                Log in
              </button>
            </div>
            <div className="toggle-panel toggle-right">
              <h1>Welcome Back!</h1>
              <p>
                Log in to access all the features of ProBusiness's learning and
                earning services.
              </p>
              <button
                className="hidden"
                id="register"
                onClick={() => setActive(false)}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
