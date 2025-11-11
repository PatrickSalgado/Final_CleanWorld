const registerOrderService = require("../service/registerOrderService.js");

async function getAllRegisterOrder(req, res) {
  try {
    const { idCollector } = req.query; // Recebe idCollector como query parameter
    if (!idCollector || isNaN(idCollector)) {
      return res.status(400).send({ message: "Invalid Collector ID!" });
    }
    const rows = await registerOrderService.getAllRegisterOrder(idCollector);
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).send({
      message: "Error getting RegisterOrders",
      body: error.message,
    });
  }
}

async function createRegisterOrder(req, res) {
  const { quantityVolume, volumeSize, collectionDate, collectionTime, address, materialDescription, wasteType, status, idUser, idCollector } = req.body;

  try {
    await registerOrderService.createRegisterOrder(
      quantityVolume,
      volumeSize,
      collectionDate,
      collectionTime,
      address,
      materialDescription,
      wasteType, // 🆕 CAMPO NOVO
      status,
      idUser,
      idCollector
    );
    res.status(201).json({ message: "Success" });
  } catch (error) {
    res.status(500).send({
      message: "Error adding RegisterOrder!",
      body: error.message,
    });
  }
}

async function updateRegisterOrder(req, res) {
  try {
    const { idRegisterOrder } = req.params;
    const { quantityVolume, volumeSize, collectionDate, collectionTime, address, materialDescription, wasteType, status, idUser, idCollector } = req.body;

    await registerOrderService.updateRegisterOrder(
      idRegisterOrder,
      quantityVolume,
      volumeSize,
      collectionDate,
      collectionTime,
      address,
      materialDescription,
      wasteType,
      status,
      idUser,
      idCollector
    );
    res.status(201).json({ message: "Success" });
  } catch (error) {
    res.status(500).send({
      message: "Error updating RegisterOrder!",
      body: error.message,
    });
  }
}

async function deleteRegisterOrder(req, res) {
  try {
    const { idRegisterOrder } = req.params;

    if (!idRegisterOrder || isNaN(idRegisterOrder)) {
      return res.status(400).send({ message: "Invalid RegisterOrder ID!" });
    }
    await registerOrderService.deleteRegisterOrder(idRegisterOrder);
    res.status(200).json({ message: "Success" });
  } catch (error) {
    res.status(500).send({
      message: "Error deleting RegisterOrder!",
      body: error.message,
    });
  }
}

async function getAllRegisterOrderById(req, res) {
  try {
    const { idRegisterOrder } = req.params;
    const registerOrder = await registerOrderService.getAllRegisterOrderById(idRegisterOrder);

    res.status(200).json(registerOrder);
  } catch (error) {
    res.status(500).send({
      message: "Error getting RegisterOrder!",
      body: error.message,
    });
  }
}

async function getAllCountById(req, res) {
  try {
    const { idUser } = req.params;
    const registerOrder = await registerOrderService.getAllCountById(idUser);

    res.status(200).json(registerOrder);
  } catch (error) {
    res.status(500).send({
      message: "Error getting RegisterOrder!",
      body: error.message,
    });
  }
}

async function rejectOrder(req, res) {
  const orderId = req.params.id;
  const { idCollector } = req.body;

  try {
    await registerOrderService.rejectOrder(orderId, idCollector);
    res.status(200).json({ message: "Pedido recusado com sucesso." });
  } catch (error) {
    console.error("Erro ao recusar pedido:", error);
    res.status(500).json({ message: "Erro ao recusar pedido." });
  }
}



async function rejectRegisterOrder(req, res) {
  try {
    const { idRegisterOrder } = req.params;
    const { idCollector } = req.body;

    if (!idRegisterOrder || isNaN(idRegisterOrder) || !idCollector || isNaN(idCollector)) {
      return res.status(400).send({ message: "Invalid RegisterOrder ID or Collector ID!" });
    }

    await registerOrderService.rejectOrder(idRegisterOrder, idCollector);
    res.status(201).json({ message: "Order rejected successfully" });
  } catch (error) {
    res.status(500).send({
      message: "Error rejecting RegisterOrder!",
      body: error.message,
    });
  }
}

async function getAcceptedOrdersByCollector(req, res) {
  try {
    const { idUser } = req.params;

    if (!idUser || isNaN(idUser)) {
      return res.status(400).json({ message: "Invalid Collector ID!" });
    }

    const orders = await registerOrderService.getAcceptedOrdersByCollector(Number(idUser));
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching accepted orders",
      body: error.message,
    });
  }
}

  async function getAcceptedOrdersByUser(req, res) {
  const { idUser } = req.params;

  try {
    const orders = await registerOrderService.getAcceptedOrdersByUser(idUser);
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({
      message: "Erro ao buscar pedidos aceitos",
      error: error.message,
    });
  }
}

async function getOrdersByUser(req, res) {
  const { idUser } = req.params;
  try {
    const orders = await registerOrderService.getOrdersByUser(idUser);
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({
      message: "Erro ao buscar pedidos aceitos",
      error: error.message,
    });
  }
}

async function getOrderCount(req, res) {
  const { idCollector } = req.params;

  try {
    const data = await registerOrderService.getOrderCount(idCollector);
    res.status(200).json(data);
  } catch (err) {
    console.error("Erro ao buscar total de pedidos:", err);
    res.status(500).json({ error: "Erro ao buscar pedidos." });
  }
}

const getTotalOrdersByUser = async (req, res) => {
  try {
    const { idUser } = req.params;
    const result = await registerOrderService.getTotalOrdersByUser(idUser);
    res.json(result);
  } catch (error) {
    console.error("Erro ao buscar total de pedidos:", error);
    res.status(500).json({ message: "Erro ao buscar total de pedidos" });
  }
};

module.exports = {
  getAllRegisterOrder,
  createRegisterOrder,
  updateRegisterOrder,
  deleteRegisterOrder,
  getAllRegisterOrderById,
  rejectRegisterOrder,
  getAllCountById,
  rejectOrder,
  getAcceptedOrdersByCollector,
  getAcceptedOrdersByUser,
  getOrdersByUser,
  getOrderCount,
  getTotalOrdersByUser,
};