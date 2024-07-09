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
