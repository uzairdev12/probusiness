const depositmodel = require("../Models/depositmodel");
const usermodel = require("../Models/usermodel");
const valuemodel = require("../Models/valuemodel");
const withdrawmodel = require("../Models/withdrawmodel");
module.exports.login = async (req, res) => {
  try {
    const data = req.body;

    const user = await usermodel.findOne({ email: data.email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "No account registered on this email.",
      });
    }
    if (user.banned) {
      return res.status(400).json({
        success: false,
        message: "Your account has been banned.",
      });
    }

    if (user.password === data.password) {
      return res.status(200).json({ success: true, user });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Wrong password" });
    }
  } catch (e) {
    console.log(e);
    res
      .status(500)
      .json({ success: false, message: e.message || "Server Error" });
  }
};

module.exports.signup = async (req, res) => {
  try {
    const { data, reffer } = req.body;
    let value = await valuemodel.findById("667e67c6eed2bce6005f1374");

    const existinguser = await usermodel.findOne({ email: data.email });
    if (existinguser) {
      return res
        .status(400)
        .json({ success: false, message: "Email already registered" });
    }

    if (reffer) {
      const exuser = await usermodel.findById(reffer);
      if (!exuser) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid reffer" });
      }

      if (
        !exuser.isVerified ||
        (exuser.leftuser && exuser.rightuser) ||
        exuser.banned
      ) {
        const user = new usermodel({
          name: data.name || "User",
          email: data.email,
          password: data.password,
          reward: value.joinBonus,
          balance: value.joinBonus,
          total: value.joinBonus,
        });

        await user.save();
        res.status(200).json({ success: true, user });
        return;
      }

      let user = new usermodel({
        name: data.name || "User",
        email: data.email,
        password: data.password,
        refferOf: reffer,
        reward: value.joinBonus,
        balance: value.joinBonus,
        total: value.joinBonus,
      });

      await user.save();

      res.status(200).json({ success: true, user });
    } else {
      const user = new usermodel({
        name: data.name || "User",
        email: data.email,
        password: data.password,
        reward: value.joinBonus,
        balance: value.joinBonus,
        total: value.joinBonus,
      });

      await user.save();
      res.status(200).json({ success: true, user });
    }
  } catch (e) {
    console.log(e);
    res
      .status(500)
      .json({ success: false, message: e.message || "Server Error" });
  }
};

module.exports.userDetails = async (req, res) => {
  try {
    const { userID, trees } = req.body;

    let user = await usermodel.findById(userID);
    let value = await valuemodel.findById("667e67c6eed2bce6005f1374");
    let leftuserid = "";
    let rightuserid = "";
    if (user) {
      if (trees) {
        if (user.leftuser) {
          const leftuser = await usermodel.findById(user.leftuser);
          if (leftuser) {
            if (leftuser.isVerified) {
              leftuserid = user.leftuser;
            }
            user.leftuser = leftuser.name;
          } else {
            user.leftuser = "Empty";
          }
        }
        if (user.rightuser) {
          const rightuser = await usermodel.findById(user.rightuser);
          if (rightuser) {
            if (rightuser.isVerified) {
              rightuserid = user.rightuser;
            }
            user.rightuser = rightuser.name;
          } else {
            user.rightuser = "Empty";
          }
        }
      }
      res.status(200).json({
        success: true,
        user,
        leftuserid,
        rightuserid,
        verified: user.isVerified,
        value,
      });
    } else {
      res.status(400).json({ success: false, message: "User not found" });
    }
  } catch (e) {
    res
      .status(500)
      .json({ success: false, message: e.message || "Server Error" });
  }
};
module.exports.getadmindata = async (req, res) => {
  try {
    const data = {
      users: 0,
      deposits: 0,
      withdraws: 0,
      earned: 0,
      paid: 0,
    };
    let value = await valuemodel.findById("667e67c6eed2bce6005f1374");

    const users = await usermodel.find();
    const deposits = await depositmodel.find();
    const withdraws = await withdrawmodel.find();

    data.users = users.length;

    data.deposits = deposits.filter(
      (deposit) => deposit.status === "pending"
    ).length;

    data.withdraws = withdraws.filter(
      (withdraw) => withdraw.status === "pending"
    ).length;

    data.earned = deposits
      .filter(
        (deposit) =>
          deposit.status !== "pending" && deposit.status !== "rejected"
      )
      .reduce((acc, cur) => acc + cur.amount, 0);

    data.paid = withdraws
      .filter(
        (withdraw) =>
          withdraw.status !== "pending" && withdraw.status !== "rejected"
      )
      .reduce((acc, cur) => acc + cur.amount, 0);

    res.status(200).json({ success: true, data, adminpass: value.adpas });
  } catch (e) {
    res
      .status(500)
      .json({ success: false, message: e.message || "Server Error" });
  }
};
module.exports.getValue = async (req, res) => {
  try {
    let value = await valuemodel.findById("667e67c6eed2bce6005f1374");
    if (!value) {
      throw new Error("Value not found");
    } else {
      res.status(200).json({ success: true, value });
    }
  } catch (e) {
    res
      .status(500)
      .json({ success: false, message: e.message || "Server Error" });
  }
};
module.exports.updatevalue = async (req, res) => {
  try {
    const data = req.body;
    // update the value with the whole data
    let value = await valuemodel.findById("667e67c6eed2bce6005f1374");
    if (!value) {
      throw new Error("Value not found");
    } else {
      value = await valuemodel.findByIdAndUpdate(
        "667e67c6eed2bce6005f1374",
        data
      );
      res.status(200).json({ success: true, value });
    }
  } catch (e) {
    res
      .status(500)
      .json({ success: false, message: e.message || "Server Error" });
  }
};
module.exports.getallusers = async (req, res) => {
  try {
    const users = await usermodel.find();
    res.status(200).json({ success: true, users });
  } catch (e) {
    res
      .status(500)
      .json({ success: false, message: e.message || "Server Error" });
  }
};
module.exports.getUserDetails = async (req, res) => {
  try {
    const { id } = req.body;
    const user = await usermodel.findById(id);

    if (!user) {
      throw new Error("User not found");
    }
    res.status(200).json({ success: true, user });
  } catch (e) {
    res
      .status(500)
      .json({ success: false, message: e.message || "Server Error" });
  }
};
module.exports.editUser = async (req, res) => {
  try {
    const { user } = req.body;

    if (!user || !user._id) {
      throw new Error("Invalid request body");
    }

    const { _id, ...data } = user;

    const user2 = await usermodel.findByIdAndUpdate(_id, data);
    if (!user2) {
      throw new Error("User not found");
    }
    res.status(200).json({ success: true, user2 });
  } catch (e) {
    console.error(e);
    res
      .status(500)
      .json({ success: false, message: e.message || "Server Error" });
  }
};
