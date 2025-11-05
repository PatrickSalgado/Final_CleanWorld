const express = require("express");
const router = express.Router();
const registerOrderController = require("../controller/registerOrderController.js");

router.get("/registerOrder", registerOrderController.getAllRegisterOrder);
router.get("/registerOrder/count/:id", registerOrderController.getAllCountById);
router.get("/registerOrder/:idRegisterOrder", registerOrderController.getAllRegisterOrderById);
router.post("/registerOrder", registerOrderController.createRegisterOrder);
router.put("/registerOrder/:idRegisterOrder", registerOrderController.updateRegisterOrder);
router.delete("/registerOrder/:idRegisterOrder", registerOrderController.deleteRegisterOrder);
router.post("/registerOrder/:id/reject", registerOrderController.rejectOrder);
router.get("/registerOrder/status/:idCollector", registerOrderController.getAcceptedOrdersByCollector);
router.get("/registerOrder/:idUser/all", registerOrderController.getOrdersByUser);
router.get("/registerOrder/status/:idUser", registerOrderController.getAcceptedOrdersByUser);
router.get("/registerOrder/count/stats/:idUser", registerOrderController.getTotalOrdersByUser);

router.get("/registerOrder/status/count/:idCollector",registerOrderController.getOrderCount);



module.exports = router;