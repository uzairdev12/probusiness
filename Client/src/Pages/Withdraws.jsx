import React, { useEffect, useState } from "react";
import "./deposits.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { TailSpin } from "react-loader-spinner";
import { ClickAwayListener } from "@mui/material";
const Withdraws = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [withdrawals, setWithdrawals] = useState([]);
  const [value, setValue] = useState({});
  const loadWithdrawals = async () => {
    try {
      const res = await fetch(
        "https://probusinessapi.vercel.app/api/withdraw/get",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const response = await res.json();
      console.log(response);
      if (response.success === false) {
        toast.error(response.message || "Something went wrong !");
      } else {
        setWithdrawals(response.withdraws);
        setValue(response.value);

        setLoading(false);
      }
    } catch (e) {
      toast.error(e.message || "Something went wrong !");
    }
  };
  useState(() => {
    loadWithdrawals();
  }, []);
  const accept = async (id) => {
    try {
      const res = await fetch(
        "https://probusinessapi.vercel.app/api/withdraw/accept",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id }),
        }
      );
      const response = await res.json();
      if (response.success === false) {
        toast.error(response.message || "Something went wrong !");
      } else {
        toast.success("Withdrawal Accepted !");
        loadWithdrawals();
      }
    } catch (e) {
      toast.error(e.message || "Something went wrong !");
    }
  };
  const reject = async (id) => {
    try {
      const res = await fetch(
        "https://probusinessapi.vercel.app/api/withdraw/reject",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id }),
        }
      );
      const response = await res.json();
      if (response.success === false) {
        toast.error(response.message || "Something went wrong !");
      } else {
        toast.success("Withdrawal Rejected !");
        loadWithdrawals();
      }
    } catch (e) {
      toast.error(e.message || "Something went wrong !");
    }
  };
  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = String(date.getFullYear()).slice(-2); // Get the last two digits of the year

    return `${day}/${month}/${year}`;
  }
  function convertDate(dateString) {
    const date = new Date(dateString);

    const month = date.getMonth() + 1; // Months are zero-indexed
    const day = date.getDate();
    const year = date.getFullYear().toString().slice(-2); // Get last two digits of the year

    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "pm" : "am";

    hours = hours % 12;
    hours = hours ? hours : 12; // The hour '0' should be '12'

    const formattedDate = `${month}/${day}/${year} ${hours}:${minutes
      .toString()
      .padStart(2, "0")}${ampm}`;
    return formattedDate;
  }
  return (
    <>
      <div className="backarrow">
        <ArrowBackIcon onClick={() => navigate(-1)} />
      </div>
      <div className="deposits">
        {loading ? (
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
        ) : (
          <>
            <h1>Withdraws ({withdrawals.length}) :</h1>
            <div className="depositscards">
              {withdrawals ? (
                withdrawals.map((e, i) => (
                  <div className="depositscard" key={i}>
                    <div className="row">
                      <p>Amount : </p>
                      <h2>{e.amount}pkr</h2>
                    </div>
                    <div className="row">
                      <p>Amount to send : </p>
                      <h2>{e.amount - e.amount * (value.fees / 100)}pkr</h2>
                    </div>
                    <div className="row">
                      <p>Name : </p>
                      <h2>{e.name}</h2>
                    </div>
                    <div className="row">
                      <p>Phone : </p>
                      <h2>{e.number}</h2>
                    </div>
                    <div className="row">
                      <p>Platform : </p>
                      <h2>{e.platform}</h2>
                    </div>

                    <div className="row">
                      <p>Date : </p>
                      <h2>{convertDate(e.date)}</h2>
                    </div>
                    <div
                      className="buttonsindeposit"
                      style={{ margin: "30px 0 0 0" }}
                    >
                      <button
                        onClick={() => {
                          accept(e._id);
                        }}
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => {
                          reject(e._id);
                        }}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <h1>No Withdraws</h1>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Withdraws;
