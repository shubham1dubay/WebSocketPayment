const router = require("express").Router();
const controller = require("../controllers/payment.controller");

router.post("/checkout", controller.checkout);

module.exports = router;
