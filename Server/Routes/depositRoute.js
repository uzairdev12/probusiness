const express = require("express");
const {
  deposit,
  getdata,
  getdeposits,
  accept,
  reject,
} = require("../Controllers/depositControllers");
const router = express.Router();

router.post("/new", deposit);

router.post("/getdata", getdata);
router.get("/get", getdeposits);
router.post("/accept", accept);
router.post("/reject", reject);

module.exports = router;
