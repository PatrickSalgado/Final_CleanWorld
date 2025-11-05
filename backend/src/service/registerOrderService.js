const mysql = require("mysql2/promise");
const databaseConfig = require("../config/database.js");

async function getAllRegisterOrder(){
    const connection = await mysql.createConnection(databaseConfig);

    const [rows] = await connection.query(`SELECT
    registerOrder.idregisterOrder,
    registerOrder.quantityVolume,
    registerOrder.volumeSize,
    registerOrder.collectionDate,
    registerOrder.collectionTime,
    registerOrder.address,
    registerOrder.materialDescription,
    registerOrder.status,
    registerOrder.idCollector,
    user.idUser,
    user.name,
    user.cpf,
    user.phone,
    user.birthDate,
    user.userType
    FROM registerOrder
    LEFT JOIN user
    ON registerOrder.iduser = user.iduser`);

    await connection.end();

    return rows;
}

async function createRegisterOrder(quantityVolume, volumeSize, collectionDate, collectionTime, address, materialDescription, wasteType, status, idUser, idCollector) {
  const connection = await mysql.createConnection(databaseConfig);

  const query = `
    INSERT INTO registerOrder
    (quantityVolume, volumeSize, collectionDate, collectionTime, address, materialDescription, wasteType, status, idUser, idCollector)
    VALUES (?, ?, STR_TO_DATE(?, '%d/%m/%Y'), ?, ?, ?, ?, ?, ?, ?)
  `;

  await connection.query(query, [
    quantityVolume,
    volumeSize,
    collectionDate,
    collectionTime,
    address,
    materialDescription,
    wasteType, // 🆕
    status,
    idUser,
    idCollector,
  ]);

  await connection.end();
}

async function updateRegisterOrder(idRegisterOrder, quantityVolume, volumeSize, collectionDate, collectionTime, address, materialDescription, wasteType, status, idUser, idCollector) {
  const connection = await mysql.createConnection(databaseConfig);

  const query = `
    UPDATE registerOrder
    SET quantityVolume = ?, volumeSize = ?, collectionDate = STR_TO_DATE(?, '%d/%m/%Y'),
        collectionTime = ?, address = ?, materialDescription = ?, wasteType = ?, status = ?, idUser = ?, idCollector = ?
    WHERE idRegisterOrder = ?
  `;

  await connection.query(query, [
    quantityVolume,
    volumeSize,
    collectionDate,
    collectionTime,
    address,
    materialDescription,
    wasteType, // 🆕
    status,
    idUser,
    idCollector,
    idRegisterOrder,
  ]);

  await connection.end();
}

async function deleteRegisterOrder(idRegisterOrder) {
    const connection = await mysql.createConnection(databaseConfig); 

    await connection.query("DELETE FROM RegisterOrder WHERE idRegisterOrder = ?", [idRegisterOrder]);

    await connection.end();
}

async function getAllRegisterOrderById(idRegisterOrder){
    
    const connection = await mysql.createConnection(databaseConfig);

    const [coletor] = await connection.query(`SELECT * FROM RegisterOrder WHERE idRegisterOrder = ?`, [idRegisterOrder]);

    await connection.end();
    
    return coletor;
}

async function getAllCountById(idUser){
    
    const connection = await mysql.createConnection(databaseConfig);

    const [row] = await connection.query(`SELECT * FROM RegisterOrder WHERE idUser = ?`, [idUser]);

    await connection.end();
    
    return row;
}

async function rejectOrder(idRegisterOrder, idCollector) {
  const connection = await mysql.createConnection(databaseConfig);

  // Atualiza o status para 2 (Rejeitado)
  const query = `
    UPDATE registerOrder
    SET status = 2, idCollector = ?
    WHERE idRegisterOrder = ?
  `;

  await connection.query(query, [idCollector, idRegisterOrder]);
  await connection.end();
}


async function getAcceptedOrdersByCollector(idUser) {
  const connection = await mysql.createConnection(databaseConfig);

  const query = `
    SELECT * FROM registerOrder WHERE idUser = ? AND status = 1
  `;

  const [rows] = await connection.execute(query, [idUser]);

  await connection.end();

  return rows;
}

async function getAcceptedOrdersByUser(idUser) {
  const connection = await mysql.createConnection(databaseConfig);

  const query = `
    SELECT * FROM registerOrder
    WHERE idUser = ? AND status = 1
  `;

  const [rows] = await connection.execute(query, [idUser]);

  await connection.end();

  return rows;
}

async function getOrdersByUser(idUser) {
  const connection = await mysql.createConnection(databaseConfig);

  const query = `
    SELECT * FROM registerOrder
    WHERE idUser = ?
  `;

  const [rows] = await connection.execute(query, [idUser]);

  await connection.end();

  return rows;
}

async function getOrderCount(idCollector) {
  const connection = await mysql.createConnection(databaseConfig);
  const [rows] = await connection.query(`
    SELECT COUNT(*) AS totalOrders 
    FROM registerOrder 
    WHERE idCollector = ? AND status = 1
  `, [idCollector]);
  await connection.end();
  return rows[0];
}

async function getTotalOrdersByUser(idUser) {
  const connection = await mysql.createConnection(databaseConfig);

  const [rows] = await connection.query(`
    SELECT COUNT(*) AS totalRegistered
    FROM registerOrder
    WHERE idUser = ?
  `, [idUser]);

  await connection.end();
  return rows[0];
}

module.exports = {
    getAllRegisterOrder,
    createRegisterOrder,
    updateRegisterOrder,
    deleteRegisterOrder,
    getAllRegisterOrderById,
    getAllCountById,
    rejectOrder,
    getOrderCount,
    getAcceptedOrdersByCollector,
    getAcceptedOrdersByUser,
    getOrdersByUser,
    getTotalOrdersByUser,
};

