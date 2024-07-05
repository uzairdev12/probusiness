const withdrawmodel = require("../Models/withdrawmodel");
const usermodel = require("../Models/usermodel");
const valuemodel = require("../Models/valuemodel");

module.exports.deposit = async (req, res) => {
  try {
    let value = await valuemodel.findById("667e67c6eed2bce6005f1374");
    if (!value.withdraw) {
      throw new Error(
        "Withdraws are currently disabled, Please try again later."
      );
    }
    const { reqData } = req.body;
    const data = reqData;
    console.log(data);
    if (!data || !data.userid) {
      throw new Error("Invalid request body");
    }

    const user = await usermodel.findById(data.userid);
    if (!user) {
      throw new Error("User not found");
    }
    if (user.balance < data.amount) {
      throw new Error("Insufficient balance");
    }

    const deposit = new withdrawmodel(data);
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
    let value = await valuemodel.findById("667e67c6eed2bce6005f1374");
    const { userid } = req.body;
    if (!userid) {
      res.status(500).json({ success: false, message: "server error", value });
    }

    const deposits = await withdrawmodel.find({ userid }).sort({ _id: -1 });

    if (!deposits) {
      res.status(500).json({ success: false, message: "No Withdraws.", value });
    }
    return res.status(200).json({ success: true, deposits, value });
  } catch (e) {
    console.error(e);
    res
      .status(500)
      .json({ success: false, message: e.message || "Server Error" });
  }
};
module.exports.getwithdrawals = async (req, res) => {
  try {
    let value = await valuemodel.findById("667e67c6eed2bce6005f1374");
    const withdraws = await withdrawmodel
      .find({ status: "pending" })
      .sort({ _id: -1 });

    if (!withdraws) {
      throw new Error("No withdrawals found");
    } else {
      return res.status(200).json({ success: true, withdraws, value });
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

    if (!id) {
      throw new Error("Invalid request body");
    }
    const withdraw = await withdrawmodel.findById(id);
    withdraw.status = "approved";
    await withdraw.save();
    const user = await usermodel.findById(withdraw.userid);
    user.balance = user.balance - withdraw.amount;
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
    const withdraw = await withdrawmodel.findById(id);
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
