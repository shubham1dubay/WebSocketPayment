const router = require("express").Router();
const controller = require("../controllers/order.controller");

router.post("/create", controller.createOrder);
router.get("/:id", controller.getOrder);

module.exports = router;
