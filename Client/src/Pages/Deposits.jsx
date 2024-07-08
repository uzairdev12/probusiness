import React, { useState } from "react";
import "./deposits.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { TailSpin } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Deposits = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [deposits, setDeposits] = useState([]);
  const [loading2, setLoading2] = useState("");

  const loadDeposits = async () => {
    try {
      const res = await fetch(
        "https://probusinessapi.vercel.app/api/deposit/get",
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
      } else {
        setDeposits(response.deposits);
        setLoading(false);
      }
    } catch (e) {
      toast.error(e.message || "Something went wrong !");
    }
  };

  useState(() => {
    loadDeposits();
  }, []);

  const accept = async (id) => {
    try {
      setLoading2(id);
      const res = await fetch(
        "https://probusinessapi.vercel.app/api/deposit/accept",
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
        setLoading2("");
      } else {
        toast.success("Deposit Accepted !");
        loadDeposits();
        setLoading2("");
      }
    } catch (e) {
      toast.error(e.message || "Something went wrong !");
      setLoading2("");
    }
  };
  const reject = async (id) => {
    try {
      setLoading2(id);
      const res = await fetch(
        "https://probusinessapi.vercel.app/api/deposit/reject",
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
        setLoading2("");
      } else {
        toast.success("Deposit Rejected !");
        loadDeposits();
        setLoading2("");
      }
    } catch (e) {
      toast.error(e.message || "Something went wrong !");
      setLoading2("");
    }
  };
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
        <ArrowBackIcon onClick={() => window.history.back()} />
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
            <h1>Deposits ({deposits.length}) :</h1>
            <div className="depositscards">
              {deposits ? (
                deposits.map((e, i) => (
                  <div className="depositscard" key={i}>
                    <div className="row">
                      <p>Amount : </p>
                      <h2>{e.amount}pkr</h2>
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
                      <p>TID : </p>
                      <h2>{e.tid}</h2>
                    </div>
                    <div className="row">
                      <p>Date : </p>
                      <h2>{convertDate(e.date)}</h2>
                    </div>
                    <p
                      className="proof"
                      onClick={() => {
                        window.open(e.imageurl, "_blank");
                      }}
                    >
                      Proof of payment
                    </p>
                    <div className="buttonsindeposit">
                      <button
                        onClick={() => {
                          if (loading2 !== e._id) {
                            accept(e._id);
                          }
                        }}
                      >
                        {loading2 === e._id ? (
                          <TailSpin
                            visible={true}
                            height="20"
                            width="20"
                            color="rgb(0, 0, 0)"
                            ariaLabel="tail-spin-loading"
                            radius="1"
                            wrapperStyle={{}}
                            wrapperClass=""
                          />
                        ) : (
                          "Accept"
                        )}
                      </button>
                      <button
                        onClick={() => {
                          if (loading2 !== e._id) {
                            reject(e._id);
                          }
                        }}
                      >
                        {loading2 === e._id ? (
                          <TailSpin
                            visible={true}
                            height="20"
                            width="20"
                            color="rgb(0, 0, 0)"
                            ariaLabel="tail-spin-loading"
                            radius="1"
                            wrapperStyle={{}}
                            wrapperClass=""
                          />
                        ) : (
                          "Reject"
                        )}
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p>no deposits found</p>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Deposits;
