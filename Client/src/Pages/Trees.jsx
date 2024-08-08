import React, { useEffect, useState } from "react";
import "./trees.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { TailSpin } from "react-loader-spinner";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";

const Trees = () => {
  const navigate = useNavigate();

  const { id } = useParams();
  const [user, setUser] = useState(false);
  const [loading, setLoading] = useState(true);
  const [leftUserId, setLeftUserId] = useState("");
  const [rightUserId, setRightUserId] = useState("");
  const [selected, setSelected] = useState("");
  const [showopt, setShowopt] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (id === null) {
          window.location.href = "/login";
          setLoading(false);
        } else {
          const user = await fetch(
            "https://theprobusiness.vercel.app/api/auth/userDetails",
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
          setLeftUserId(parsedData.leftuserid);
          setRightUserId(parsedData.rightuserid);
          setLoading(false);
        }
      } catch (e) {
        toast.error(e.message || "Server Error");
        localStorage.clear();
        navigate("/login");
      }
    };
    fetchData();
  }, [id]);

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
                <p
                  onClick={() => {
                    if (leftUserId) {
                      setSelected(leftUserId);
                      setShowopt(true);
                    } else {
                      toast.error(
                        "The user either does not exist or hasn't deposited yet. "
                      );
                    }
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <span>{user.leftuser}</span>
                </p>
                <p>{user.leftusers}</p>
              </div>
              <div className="righttree">
                <p>
                  <span
                    onClick={() => {
                      if (rightUserId) {
                        setSelected(rightUserId);
                        setShowopt(true);
                      } else {
                        toast.error(
                          "The user either does not exist or hasn't deposited yet. "
                        );
                      }
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    {user.rightuser}
                  </span>
                </p>
                <p>{user.rightusers}</p>
              </div>
            </div>
          </div>
        </>
      )}
      {showopt && (
        <div className="treewrapper">
          <button
            onClick={() => {
              navigate(`/trees/${selected}`);
              setShowopt(false);
            }}
          >
            Go to trees
          </button>
          <button
            onClick={() => {
              navigator.clipboard.writeText(
                `https://theprobusiness.vercel.app/login/${user._id}`
              );
              toast.success("copied to clipboard");
              setShowopt(false);
            }}
          >
            copy reffer link
          </button>
          <button onClick={() => setShowopt(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default Trees;
