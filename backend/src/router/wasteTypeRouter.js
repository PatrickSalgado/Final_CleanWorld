const express = require("express");
const router = express.Router();
const wasteTypeController = require("../controller/wasteTypeController.js");

router.get("/wasteType", wasteTypeController.getAllWasteType);
router.post("/wasteType", wasteTypeController.createWasteType);
router.put("/wasteType/:id_tipo_residuo", wasteTypeController.updateWasteType);
router.delete("/wasteType/:id_tipo_residuo", wasteTypeController.deleteWasteType);
router.get("/wasteType/:id_tipo_residuo", wasteTypeController.getWasteTypeById);


module.exports = router;