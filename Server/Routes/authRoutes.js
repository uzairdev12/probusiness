const express = require("express");
const {
  login,
  signup,
  userDetails,
  getadmindata,
  getValue,
  updatevalue,
} = require("../Controllers/authControllers");
const router = express.Router();

router.post("/login", login);
router.post("/signup", signup);
router.post("/userDetails", userDetails);
router.get("/getadmindata", getadmindata);
router.get("/getvalue", getValue);
router.post("/updatevalue", updatevalue);

module.exports = router;
