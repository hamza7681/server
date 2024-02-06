const router = require("express").Router();

router.use("/auth", require("./user.routes"));

module.exports = router;
