import React, { useEffect, useState } from "react";
import "./deposit.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import { TailSpin } from "react-loader-spinner";

const Deposit = () => {
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(true);
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  const { id } = useParams();
  const loadUser = async () => {
    try {
      const response = await fetch(
        "https://probusinessapi.vercel.app/api/auth/getuser",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id }),
        }
      );
      const res = await response.json();
      if (res.success === false) {
        toast.error(res.message || "Something went wrong !");
        setLoading2(false);
      } else {
        setUser(res.user);
        setLoading2(false);
      }
    } catch (e) {
      toast.error(e.message || "Something went wrong !");
      setLoading2(false);
    }
  };
  useEffect(() => {
    loadUser();
  }, []);

  const changeUser = async () => {
    try {
      const response = await fetch(
        "https://probusinessapi.vercel.app/api/auth/edituser",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user }),
        }
      );
      const res = await response.json();
      if (res.success === false) {
        toast.error(res.message || "Something went wrong !");
      } else {
        toast.success("User edited successfully !");
        navigate(-1);
      }
    } catch (e) {
      toast.error(e.message || "Something went wrong !");
    }
  };
  return (
    <div className="depositPage">
      <div className="backarrow">
        <ArrowBackIcon onClick={() => window.history.back()} />
      </div>
      <h1 className="heading">EditUser</h1>

      {!loading2 ? (
        <>
          <>
            <p>Here, you can edit all the users details. :</p>

            <div className="inputs">
              {" "}
              <hr style={{ width: "100%" }} />
              <h1 className="heading" style={{ marginTop: "0 !important" }}>
                User Details :
              </h1>
              <label htmlFor="amount">Name</label>
              <input
                id="amount"
                type="text"
                placeholder="Name"
                value={user.name}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
              />
              <label htmlFor="account2">Email</label>
              <input
                id="account2"
                type="text"
                placeholder="Email"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
              />
              <label htmlFor="account3">Password</label>
              <input
                id="account3"
                type="text"
                placeholder="Password"
                value={user.password}
                onChange={(e) => setUser({ ...user, password: e.target.value })}
              />
              <label htmlFor="account4">Balance</label>
              <input
                id="account4"
                type="number"
                placeholder="Balance"
                value={user.balance}
                onChange={(e) => setUser({ ...user, balance: e.target.value })}
              />
              <label htmlFor="account5">Reward</label>
              <input
                id="account5"
                type="number"
                placeholder="Reward"
                value={user.reward}
                onChange={(e) => setUser({ ...user, reward: e.target.value })}
              />
              <label htmlFor="account6">Total</label>
              <input
                id="account6"
                type="number"
                placeholder="Total"
                value={user.total}
                onChange={(e) => setUser({ ...user, total: e.target.value })}
              />
              <label htmlFor="account7">Total Pairs</label>
              <input
                id="account7"
                type="number"
                placeholder="Total Pairs"
                value={user.totalPairs}
                onChange={(e) =>
                  setUser({ ...user, totalPairs: e.target.value })
                }
              />
              <div className="checkboxdiv">
                <label htmlFor="account91">Banned</label>
                <input
                  id="account91"
                  type="checkbox"
                  onChange={(e) => {
                    setUser({ ...user, banned: e.target.checked });
                  }}
                  checked={user.banned}
                />
              </div>
              <button onClick={changeUser}>
                {loading ? "Loading..." : "Submit"}
              </button>
            </div>
          </>
        </>
      ) : (
        <>
          <div className="spinner">
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
        </>
      )}
    </div>
  );
};

export default Deposit;
