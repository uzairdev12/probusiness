const express = require("express");
const {
  getdata,
  deposit,
  getwithdrawals,
  accept,
  reject,
} = require("../Controllers/withdrawControllers");
const router = express.Router();

router.post("/new", deposit);

router.post("/getdata", getdata);
router.get("/get", getwithdrawals);
router.post("/accept", accept);
router.post("/reject", reject);

module.exports = router;
