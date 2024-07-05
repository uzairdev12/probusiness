import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import logo from "../assets/prologo.png";
import "./admin.css";
import { TailSpin } from "react-loader-spinner";
import "./dashboard.css";
import { useNavigate } from "react-router";

const Admin = () => {
  let verified = localStorage.getItem("verified") === "true";
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});

  const navigate = useNavigate();
  const loadData = async () => {
    try {
      const res = await fetch(
        "https://probusinessapi.vercel.app/api/auth/getadmindata",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const response = await res.json();
      if (response.success === false) {
        toast.error(response.message || "Something went wrong !");
        setLoading(false);
      } else {
        setData(response.data);
        setLoading(false);
      }
    } catch (e) {
      toast.error(e.message || "Something went wrong !");
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  });

  return (
    <div className="admin">
      {!verified ? (
        <div className="passwordpage">
          <div className="passworddiv">
            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              onClick={() => {
                if (password === "probusinessadminaccess") {
                  localStorage.setItem("verified", "true");
                  window.location.reload();
                } else {
                  toast.error("Wrong Password");
                }
              }}
            >
              Submit
            </button>
          </div>
        </div>
      ) : (
        <div className="dashboard">
          {!loading && data ? (
            <>
              <img src={logo} alt="logo" className="logo" />
              <h1 className="welcome">
                <span className="name">Admin Panel :</span>{" "}
              </h1>
              <div className="buttons">
                <button
                  className="button"
                  onClick={() => {
                    navigate("/admindashboard/deposits");
                  }}
                >
                  Deposits
                </button>
                <button
                  className="button"
                  onClick={() => {
                    navigate("/admindashboard/withdraws");
                  }}
                >
                  {" "}
                  Withdraws
                </button>
                <button
                  className="button"
                  onClick={() => {
                    navigate("/admindashboard/changevalues");
                  }}
                >
                  Change Values
                </button>
                <button
                  className="button"
                  onClick={() => {
                    localStorage.removeItem("verified");
                    navigate("/");
                  }}
                >
                  Logout
                </button>
              </div>
              <div className="cardsDiv">
                <div className="infoContainer">
                  <div className="head">
                    <p>Users</p>
                  </div>

                  <p>{data.users}</p>
                </div>
                <div className="infoContainer">
                  <div className="head">
                    <p>Deposits</p>
                  </div>
                  <p>{data.deposits}</p>
                </div>
                <div className="infoContainer">
                  <div className="head">
                    <p>Withdraws</p>
                  </div>
                  <p>{data.withdraws}</p>
                </div>
                <div className="infoContainer">
                  <div className="head">
                    <p>Earned</p>
                  </div>
                  <p>{data.earned}pkr</p>
                </div>
                <div className="infoContainer">
                  <div className="head">
                    <p>Paid</p>
                  </div>
                  <p>{data.paid}pkr</p>
                </div>
              </div>
            </>
          ) : (
            <div className="loaderdiv">
              <TailSpin
                visible={true}
                height="50"
                width="50"
                color="rgb(0, 0, 0)"
                ariaLabel="tail-spin-loading"
                radius="1"
                wrapperStyle={{}}
                wrapperClass=""
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Admin;
