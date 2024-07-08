import React, { useEffect, useState } from "react";
import "./trees.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { TailSpin } from "react-loader-spinner";
import { useNavigate } from "react-router";
import { toast } from "sonner";

const Trees = () => {
  const navigate = useNavigate();

  const id = localStorage.getItem("userID");
  const [user, setUser] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (id === null) {
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
              body: JSON.stringify({ userID: id, trees: true }),
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

  return (
    <div className="treesPage">
      <div className="backarrow">
        <ArrowBackIcon onClick={() => navigate(-1)} />
      </div>
      <h1>Your trees</h1>
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
          <h2>
            Total pairs: <span>{user.totalPairs}</span>
          </h2>
          <hr />
          <div className="tree">
            <h2>{user.name}</h2>
            <div className="trees">
              <div className="lefttree">
                <p>
                  <span>{user.leftuser}</span>
                </p>
                <p>{user.leftusers}</p>
              </div>
              <div className="righttree">
                <p>
                  <span>{user.rightuser}</span>
                </p>
                <p>{user.rightusers}</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Trees;
