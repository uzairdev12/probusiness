const depositmodel = require("../Models/depositmodel");
const usermodel = require("../Models/usermodel");
const valuemodel = require("../Models/valuemodel");

module.exports.deposit = async (req, res) => {
  try {
    let value = await valuemodel.findById("667e67c6eed2bce6005f1374");
    if (!value.deposit) {
      throw new Error(
        "Deposits are currently disabled, Please try again later."
      );
    }
    const { reqData } = req.body;
    const data = reqData;
    if (!data || !data.userid) {
      throw new Error("Invalid request body");
    }

    const user = await usermodel.findById(data.userid);
    if (!user) {
      throw new Error("User not found");
    }

    const deposit = new depositmodel(data);
    const savedDeposit = await deposit.save();

    res.status(200).json({ success: true, deposit: savedDeposit });
  } catch (e) {
    console.error(e);
    res
      .status(500)
      .json({ success: false, message: e.message || "Server Error" });
  }
};

module.exports.getdata = async (req, res) => {
  try {
    const { userid } = req.body;

    let value = await valuemodel.findById("667e67c6eed2bce6005f1374");
    if (!userid) {
      res.status(500).json({ success: false, message: "Server Error", value });
    }

    const deposits = await depositmodel.find({ userid }).sort({ _id: -1 });

    if (!deposits) {
      res
        .status(500)
        .json({ success: false, message: "No Deposits found", value });
    }
    return res.status(200).json({ success: true, deposits, value });
  } catch (e) {
    console.error(e);
    res
      .status(500)
      .json({ success: false, message: e.message || "Server Error" });
  }
};
module.exports.getdeposits = async (req, res) => {
  try {
    const deposits = await depositmodel
      .find({ status: "pending" })
      .sort({ _id: -1 });

    if (!deposits) {
      throw new Error("No deposits found");
    } else {
      return res.status(200).json({ success: true, deposits });
    }
  } catch (e) {
    console.error(e);
    res
      .status(500)
      .json({ success: false, message: e.message || "Server Error" });
  }
};

const updateUserCounts = async (userId, leftie, value) => {
  // Recursive function to update user counts
  if (!userId) return;

  const user = await usermodel.findById(userId);
  if (!user) return;

  if (leftie) {
    user.leftusers += 1;
  } else {
    user.rightusers += 1;
  }

  const newTotalPairs = Math.min(user.leftusers, user.rightusers);

  if (newTotalPairs > user.totalPairs) {
    const pairsIncrease = newTotalPairs - user.totalPairs;
    user.balance += pairsIncrease * value.refferBonus2;
    user.earnedbyreffers += pairsIncrease * value.refferBonus2;
  }

  user.totalPairs = newTotalPairs;

  if (user.totalPairs == 5) {
    user.reward += 350;
  } else if (user.totalPairs == 10) {
    user.reward += 750;
  } else if (user.totalPairs == 50) {
    user.reward += 1000;
  } else if (user.totalPairs == 100) {
    user.reward += 2000;
  } else if (user.totalPairs == 500) {
    user.reward += 3000;
  } else if (user.totalPairs == 1000) {
    user.reward += 5000;
  } else if (user.totalPairs == 5000) {
    user.reward += 20000;
  } else if (user.totalPairs == 10000) {
    user.reward += 50000;
  } else if (user.totalPairs == 20000) {
    user.reward += 100000;
  } else if (user.totalPairs == 50000) {
    user.reward += 500000;
  }

  await user.save();

  await updateUserCounts(user.refferOf, user.leftie);
};
module.exports.accept = async (req, res) => {
  try {
    const { id } = req.body;

    let value = await valuemodel.findById("667e67c6eed2bce6005f1374");

    if (!id) {
      throw new Error("Invalid request body");
    }
    const withdraw = await depositmodel.findById(id);
    withdraw.status = "approved";
    await withdraw.save();
    const user = await usermodel.findById(withdraw.userid);
    user.deposited = user.deposited + withdraw.amount;

    if (user.deposited >= value.req) {
      user.isVerified = true;
      const exuser = await usermodel.findById(user.refferOf);
      if (exuser) {
        if (exuser.leftuser && exuser.rightuser) {
        } else {
          if (exuser.leftuser) {
            exuser.rightuser = user._id;
            exuser.balance += value.refferBonus1;
            exuser.total += value.refferBonus1;
            exuser.earnedbyreffers += value.refferBonus1;
            user.rightie = true;
          } else {
            exuser.leftuser = user._id;
            user.leftie = true;
          }
          await exuser.save();
          await updateUserCounts(exuser.refferOf, exuser.leftie, value);
        }
      }
    }

    await user.save();
    res.status(200).json({ success: true, withdraw });
  } catch (e) {
    console.error(e);
    res
      .status(500)
      .json({ success: false, message: e.message || "Server Error" });
  }
};
module.exports.reject = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      throw new Error("Invalid request body");
    }
    const withdraw = await depositmodel.findById(id);
    withdraw.status = "rejected";
    await withdraw.save();
    res.status(200).json({ success: true, withdraw });
  } catch (e) {
    console.error(e);
    res
      .status(500)
      .json({ success: false, message: e.message || "Server Error" });
  }
};
