import React, { useEffect, useState } from "react";
import "./deposit.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { TailSpin } from "react-loader-spinner";

const Deposit = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    joinBonus: 0,
    refferBonus1: 0,
    refferBonus2: 0,
    deposit: false,
    withdraw: false,
    fees: 0,
    req: 0,
    easypaisaNumber: "",
    easypaisaName: "",
    jazzcashName: "",
    jazzcashNumber: "",
    adpas: "",
  });
  const [loading2, setloading2] = useState(false);
  const [loading, setloading] = useState(true);
  const loadData = async () => {
    try {
      const res = await fetch(
        "https://probusinessapi.vercel.app/api/auth/getvalue",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const response = await res.json();
      if (response.success && response.value) {
        setData(response.value);
        setloading(false);
      } else {
        throw new Error(response.message);
      }
    } catch (e) {
      console.log(e);
      toast.error(e.message || "Something went wrong !");
      navigate("/");
    }
  };
  useEffect(() => {
    loadData();
  }, []);
  const updateValues = async () => {
    setloading2(true);
    try {
      const res = await fetch(
        "https://probusinessapi.vercel.app/api/auth/updatevalue",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      const response = await res.json();
      if (response.success) {
        toast.success("Values updated successfully");
        setloading2(false);
        navigate(-1);
      } else {
        toast.error(response.message || "Something went wrong !");
        setloading2(false);
      }
    } catch (e) {
      console.log(e);
      toast.error(e.message || "Something went wrong !");
      setloading2(false);
    }
  };
  return (
    <div className="depositPage">
      <div className="backarrow">
        <ArrowBackIcon onClick={() => window.history.back()} />
      </div>
      <h1 className="heading">Change Values</h1>
      {!loading ? (
        <>
          <p>Change any of the values and click the button to apply them.</p>
          <div className="inputs">
            {" "}
            <hr style={{ width: "100%" }} />{" "}
            <label htmlFor="amount">Join Bonus</label>
            <input
              id="amount"
              type="number"
              placeholder="Enter Join Bonus"
              value={data.joinBonus}
              onChange={(e) => setData({ ...data, joinBonus: e.target.value })}
            />
            <label htmlFor="account2">Direct pair earning</label>
            <input
              id="account2"
              type="number"
              placeholder="Enter direct pair earning"
              value={data.refferBonus1}
              onChange={(e) =>
                setData({ ...data, refferBonus1: e.target.value })
              }
            />
            <label htmlFor="account3">Indirect pair earning</label>
            <input
              id="account3"
              type="number"
              placeholder="Enter indirect pair earning"
              value={data.refferBonus2}
              onChange={(e) =>
                setData({ ...data, refferBonus2: e.target.value })
              }
            />
            <label htmlFor="account4">Withdraw fees</label>
            <input
              id="account4"
              type="number"
              placeholder="Enter withdraw fees"
              value={data.fees}
              onChange={(e) => setData({ ...data, fees: e.target.value })}
            />
            <label htmlFor="account5">Reffer deposit unlock</label>
            <input
              id="account5"
              type="text"
              placeholder="Enter reffer fees"
              value={data.req}
              onChange={(e) => setData({ ...data, req: e.target.value })}
            />
            <label htmlFor="account6">Easypaisa Name</label>
            <input
              id="account6"
              type="text"
              placeholder="Enter Easypaisa Name"
              value={data.easypaisaName}
              onChange={(e) =>
                setData({ ...data, easypaisaName: e.target.value })
              }
            />
            <label htmlFor="account23">Easypaisa Number</label>
            <input
              id="account23"
              type="text"
              placeholder="Enter Easypaisa Number"
              value={data.easypaisaNumber}
              onChange={(e) =>
                setData({ ...data, easypaisaNumber: e.target.value })
              }
            />
            <label htmlFor="account7">Jazzcash Name</label>
            <input
              id="account7"
              type="text"
              placeholder="Enter Jazzcash Name"
              value={data.jazzcashName}
              onChange={(e) =>
                setData({ ...data, jazzcashName: e.target.value })
              }
            />
            <label htmlFor="account8">Jazzcash Number</label>
            <input
              id="account8"
              type="text"
              placeholder="Enter Jazzcash Number"
              value={data.jazzcashNumber}
              onChange={(e) =>
                setData({ ...data, jazzcashNumber: e.target.value })
              }
            />
            <label htmlFor="account8">Dashboard Password</label>
            <input
              id="account8"
              type="text"
              placeholder="Enter Jazzcash Number"
              value={data.adpas}
              onChange={(e) => setData({ ...data, adpas: e.target.value })}
            />
            <div className="checkboxdiv">
              <label htmlFor="account9">Allow Deposit</label>
              <input
                id="account9"
                type="checkbox"
                onChange={(e) =>
                  setData({ ...data, deposit: e.target.checked })
                }
                checked={data.deposit}
              />
            </div>
            <div className="checkboxdiv">
              <label htmlFor="account91">Allow Withdraw</label>
              <input
                id="account91"
                type="checkbox"
                onChange={(e) =>
                  setData({ ...data, withdraw: e.target.checked })
                }
                checked={data.withdraw}
              />
            </div>
            <button
              className="buttonwithmargin"
              onClick={() => {
                loading2 ? null : updateValues();
              }}
            >
              {loading2 ? "Changing..." : "Change"}
            </button>
          </div>
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
