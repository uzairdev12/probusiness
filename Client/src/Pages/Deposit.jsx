import React, { useEffect, useState } from "react";
import "./deposit.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { TailSpin } from "react-loader-spinner";

const Deposit = () => {
  const [data, setData] = useState({
    amount: 0,
    number: "",
    name: "",
    platform: "Easypaisa",
    tid: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const id = localStorage.getItem("userID");
  const [prevdeposits, setprevdeposits] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [value, setValue] = useState({});
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
          `https://probusinessapi.vercel.app/api/deposit/getdata`,
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
      if (!selectedImage) {
        throw new Error("No image selected.");
      }
      if (
        !selectedImage.type ||
        !(
          selectedImage.type === "image/jpeg" ||
          selectedImage.type === "image/png" ||
          selectedImage.type === "image/jpg"
        )
      ) {
        throw new Error(
          "Invalid image format. Only JPEG, PNG, and JPG formats are allowed."
        );
      }
      setLoading(true);
      let image = new FormData();
      image.append("file", selectedImage);
      image.append("cloud_name", "dih4to80b");
      image.append("upload_preset", "probusiness");

      const url = "https://api.cloudinary.com/v1_1/dih4to80b/image/upload";
      const resp = await fetch(url, {
        method: "POST",
        body: image,
      });
      const data1 = await resp.json();
      if (!data1.url) {
        throw new Error("Error with image");
      }

      const res = await fetch(
        "https://probusinessapi.vercel.app/api/deposit/new",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            reqData: { ...data, userid: id, imageurl: data1.url },
          }),
        }
      );

      const data2 = await res.json();
      if (data2.success) {
        toast.success("Deposit request sent Successfuly !");
        navigate(-1);
        setLoading(false);
      } else {
        toast.error(data2.message || "Something went wrong");
        setLoading(false);
        navigate(-1);
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
      <h1 className="heading">Deposit</h1>

      {!loading2 ? (
        <>
          {value?.deposit ? (
            <>
              <p>
                Please send the exact amount you want to deposit on one of these
                accounts :
              </p>
              <div className="detailsbox">
                <div>
                  <strong>Easypaisa</strong>
                  <strong>
                    {value.easypaisaName ? value.easypaisaName : "NA"}
                  </strong>
                  <strong>
                    {value.easypaisaNumber ? value.easypaisaNumber : "NA"}
                  </strong>
                </div>
                <div>
                  <strong>JazzCash</strong>
                  <strong>
                    {value.jazzcashName ? value.jazzcashName : "NA"}
                  </strong>
                  <strong>
                    {value.jazzcashNumber ? value.jazzcashNumber : "NA"}
                  </strong>
                </div>
              </div>
              {/* add a line with full width*/}

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
                  placeholder="Enter Amount you want to deposit"
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
                <label htmlFor="account5">Enter Transaction ID</label>
                <input
                  id="account5"
                  type="text"
                  placeholder="Enter your Transaction id"
                  onChange={(e) => setData({ ...data, tid: e.target.value })}
                  value={data.tid}
                />
                <label htmlFor="account4">Enter Account Platform</label>
                <select
                  name="account"
                  id="account4"
                  onChange={(e) =>
                    setData({ ...data, platform: e.target.value })
                  }
                >
                  <option defaultChecked value="Easypaisa">
                    Easypaisa
                  </option>
                  <option value="Jazzcash">Jazzcash</option>
                </select>
                <label htmlFor="file">Upload Screenshot proof</label>
                <input
                  type="file"
                  onChange={(e) => setSelectedImage(e.target.files[0])}
                  accept="image/png image/jpeg image/jpg"
                />
                <button onClick={loading ? () => {} : initiateDeposit}>
                  {loading ? "Loading..." : "Deposit"}
                </button>
                <hr style={{ width: "100%" }} />
                <h1 className="heading" style={{ marginTop: "0 !important" }}>
                  Deposits history
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
                  <p>No deposits yet.</p>
                )}
              </div>
            </>
          ) : (
            <p>Deposits are currently disabled, Please try again later.</p>
          )}
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
