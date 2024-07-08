import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import "./users.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router";

const Users = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  const loadUsers = async () => {
    try {
      const response = await fetch(
        "https://probusinessapi.vercel.app/api/auth/get",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const res = await response.json();
      if (res.success === false) {
        toast.error(res.message || "Something went wrong !");
        setLoading(false);
      } else {
        setUsers(res.users);
        setLoading(false);
      }
    } catch (e) {
      toast.error(e.message || "Something went wrong !");
      setLoading(false);
    }
  };
  useEffect(() => {
    loadUsers();
  }, []);
  return (
    <div className="userspage">
      <div className="backarrow">
        <ArrowBackIcon onClick={() => navigate(-1)} />
      </div>
      <h1>Users</h1>
      <div className="contentWrapper">
        {!loading ? (
          <>
            {users?.map((user) => (
              <div
                key={user._id}
                className="user"
                onClick={() => {
                  navigate(`/edituser/${user._id}`);
                }}
              >
                <p>
                  Name: <span>{user.name}</span>{" "}
                </p>
                <p>
                  Email : <span>{user.email}</span>
                </p>
                <p>
                  Balance : <span>{user.balance}</span>
                </p>
              </div>
            ))}
          </>
        ) : (
          <h1>Loading...</h1>
        )}
      </div>
    </div>
  );
};

export default Users;
