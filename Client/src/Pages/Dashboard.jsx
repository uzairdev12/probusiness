import React, { useEffect, useState } from "react";
import { TailSpin } from "react-loader-spinner";
import { toast } from "sonner";
import "./dashboard.css";
import logo from "../assets/prologo.png";
import { useNavigate } from "react-router-dom";
import PaymentsIcon from "@mui/icons-material/Payments";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import LinkIcon from "@mui/icons-material/Link";
import LogoutIcon from "@mui/icons-material/Logout";

const Dashboard = () => {
  const loggedin = localStorage.getItem("userID");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({});
  const [value, setValue] = useState({});
  const [verified, setVerified] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (loggedin === null) {
          window.location.href = "/login";
          setLoading(false);
        } else {
          const user = await fetch(
            "https://probusinessapi.vercel.app/api/auth/userDetails",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ userID: loggedin }),
            }
          );
          const parsedData = await user.json();
          if (!parsedData.success) {
            toast.error(parsedData.message);
            setLoading(false);
            localStorage.clear();
            navigate("/login");
            return;
          }
          setUser(parsedData.user);
          setVerified(parsedData.verified);
          setValue(parsedData.value);
          localStorage.setItem("userBalance", parsedData.user.balance);
          localStorage.setItem("userReward", parsedData.user.reward);
          localStorage.setItem("userTotal", parsedData.user.total);
          localStorage.setItem("userName", parsedData.user.name);
          localStorage.setItem("userEmail", parsedData.user.email);
          setLoading(false);
        }
      } catch (e) {
        toast.error(e.message || "Server Error");
        localStorage.clear();
        navigate("/login");
      }
    };
    fetchData();
  }, []);
  const urdutext =
    "جوائننگ بونس 50 روپے، ڈائریکٹ پئیر کی ارننگ 200 روپے ہوگی، انڈائریکٹ پئیر کی ارننگ 100 روپے ہوگی۔";

  const text2 =
    "ودڈرال 24 گھنٹوں میں آپ کے اکاؤنٹ میں ہوگا۔ ودڈرال پر 10 فیصد کٹوتی ہوگی۔";
  return (
    <div className="dashboard">
      {!loading && user ? (
        <>
          <img src={logo} alt="logo" className="logo" />
          <h1 className="welcome">
            Welcome Back <span className="name">{user.name} !</span>{" "}
          </h1>
          <div className="buttons">
            <button
              className="button"
              onClick={() => {
                navigate("/withdraw");
              }}
            >
              <PaymentsIcon /> Withdraw
            </button>
            <button
              className="button"
              onClick={() => {
                navigate("/deposit");
              }}
            >
              <AttachMoneyIcon /> Deposit
            </button>
            <button
              className="button"
              onClick={() => {
                navigate("/trees");
              }}
            >
              <AccountTreeIcon /> Trees
            </button>
            <button
              className="button"
              onClick={() => {
                if (verified) {
                  navigator.clipboard.writeText(
                    `http://localhost:5173/login/${user._id}`
                  );
                  toast.success("Refferral link copied to clipboard");
                } else {
                  toast.error(
                    `You need to deposit atleast ${value.req}pkr to unlock referral link`
                  );
                }
              }}
            >
              <LinkIcon /> Referral link
            </button>
            <button
              className="button"
              onClick={() => {
                localStorage.clear();
                navigate("/login");
              }}
            >
              <LogoutIcon /> Logout
            </button>
          </div>
          <div className="cardsDiv">
            <div className="infoContainer">
              <div className="head">
                <p>Balance</p>
              </div>

              <p>{user.balance}pkr</p>
            </div>
            <div className="infoContainer">
              <div className="head">
                <p>Reward</p>
              </div>
              <p>{user.reward}pkr</p>
            </div>
            <div className="infoContainer">
              <div className="head">
                <p>Total</p>
              </div>
              <p>{user.total}pkr</p>
            </div>
          </div>
          <p className="description">{urdutext + " " + text2}</p>
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
  );
};

export default Dashboard;
