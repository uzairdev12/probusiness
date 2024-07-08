import React, { useEffect, useState } from "react";
import "./deposit.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { TailSpin } from "react-loader-spinner";

const Withdraw = () => {
  const [data, setData] = useState({
    amount: 0,
    number: "",
    name: "",
    platform: "Easypaisa",
  });
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState({});
  const navigate = useNavigate();
  const id = localStorage.getItem("userID");
  const [prevdeposits, setprevdeposits] = useState([]);
  const [loading2, setLoading2] = useState(true);
  const loadData = async () => {
    try {
      if (!id) {
        toast.error("Something went wrong !");
        localStorage.clear();
        window.location.href = "/login";
        return;
      } else {
        const res = await fetch(
          `https://probusinessapi.vercel.app/api/withdraw/getdata`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userid: id }),
          }
        );
        const response = await res.json();
        if (response.success === false) {
          toast.error(response.message || "Something went wrong !");
          setLoading2(false);
        } else {
          setprevdeposits(response.deposits);
          setValue(response.value);
          setLoading2(false);
        }
      }
    } catch (e) {
      toast.error(e.message || "Something went wrong !");
      setLoading2(false);
    }
  };
  useEffect(() => {
    loadData();
  }, []);
  const initiateDeposit = async () => {
    try {
      if (data.amount === 0) {
        toast.error("Please enter an amount");
        return;
      } else if (data.number === "" || data.name === "" || data.tid === "") {
        toast.error("Please enter all details");
        return;
      }
      if (!id) {
        toast.error("Something went wrong !");
        localStorage.clear();
        window.location.href = "/login";
        return;
      }
      setLoading(true);
      const res = await fetch(
        "https://probusinessapi.vercel.app/api/withdraw/new",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ reqData: { ...data, userid: id } }),
        }
      );

      const data2 = await res.json();
      if (data2.success) {
        toast.success("Withdraw request sent Successfuly !");
        navigate(-1);
        setLoading(false);
      } else {
        toast.error(data2.message || "Something went wrong");
        setLoading(false);
        return;
      }
    } catch (e) {
      toast.error(e.message || "Something went wrong");
      return;
    }
  };
  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = String(date.getFullYear()).slice(-2); // Get the last two digits of the year

    return `${day}/${month}/${year}`;
  }
  return (
    <div className="depositPage">
      <div className="backarrow">
        <ArrowBackIcon onClick={() => window.history.back()} />
      </div>
      <h1 className="heading">Withdraw</h1>
      {!loading2 ? (
        value?.withdraw ? (
          <>
            <p>Withdraw fees is {value.fees}%.</p>

            <div className="inputs">
              {" "}
              <hr style={{ width: "100%" }} />
              <h1 className="heading" style={{ marginTop: "0 !important" }}>
                Enter Details
              </h1>
              <label htmlFor="amount">Enter Amount</label>
              <input
                id="amount"
                type="number"
                placeholder="Enter Amount you want to Withdraw"
                onChange={(e) => setData({ ...data, amount: e.target.value })}
                value={data.amount}
              />
              <label htmlFor="account2">Enter Account Number</label>
              <input
                id="account2"
                type="text"
                placeholder="Enter your account number"
                onChange={(e) => setData({ ...data, number: e.target.value })}
                value={data.number}
              />
              <label htmlFor="account3">Enter Account Name</label>
              <input
                id="account3"
                type="text"
                placeholder="Enter your account name"
                onChange={(e) => setData({ ...data, name: e.target.value })}
                value={data.name}
              />
              <label htmlFor="account4">Enter Account Platform</label>
              <select
                name="account"
                id="account4"
                onChange={(e) => setData({ ...data, platform: e.target.value })}
              >
                <option defaultChecked value="Easypaisa">
                  Easypaisa
                </option>
                <option value="Jazzcash">Jazzcash</option>
              </select>
              <button onClick={loading ? () => {} : initiateDeposit}>
                {loading ? "Loading..." : "Withdraw"}
              </button>
              <hr style={{ width: "100%" }} />
              <h1 className="heading" style={{ marginTop: "0 !important" }}>
                Withdraws history
              </h1>
              {prevdeposits.length > 0 ? (
                prevdeposits.map((e, i) => (
                  <div
                    className="deposittab"
                    key={i}
                    style={
                      e.status === "pending"
                        ? { backgroundColor: "rgba(0, 0, 0, 0.199)" }
                        : e.status === "approved"
                        ? { backgroundColor: "rgba(8, 255, 8, 0.199)" }
                        : { backgroundColor: "rgba(255, 8, 8, 0.199)" }
                    }
                  >
                    <p>{e.amount}pkr</p>
                    <p>{formatDate(e.date)}</p>
                    <p>{e.status}</p>
                  </div>
                ))
              ) : (
                <p> No withdraws yet.</p>
              )}
            </div>
          </>
        ) : (
          <p>Withdraws are currently disabled, Please try again later.</p>
        )
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

export default Withdraw;
