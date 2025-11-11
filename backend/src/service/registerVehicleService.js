const mysql = require("mysql2/promise");
const databaseConfig = require("../config/database.js");
const bcrypt = require("bcrypt");


async function getAllRegisterVehicle(){
    const connection = await mysql.createConnection(databaseConfig);

    const [rows] = await connection.query(`SELECT *
    FROM RegisterVehicle`);
    await connection.end();
    return rows;
}

async function createRegisterVehicle(volumeSize, carBrand, carModel, carLicensePlate, maximumWeight, idCollector) {
    let connection;
    try {
        // Estabelece a conexão com o banco de dados
        connection = await mysql.createConnection(databaseConfig);

        // Query de inserção com tratamento para duplicidade
        const insertQuery = `
            INSERT INTO RegisterVehicle (volumeSize, carBrand, carModel, carLicensePlate, maximumWeight, idCollector)
            VALUES (?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE idRegisterVehicle = LAST_INSERT_ID(idRegisterVehicle)`;

        const [result] = await connection.query(insertQuery, [volumeSize, carBrand, carModel, carLicensePlate, maximumWeight, idCollector]);


        const insertedId = result.insertId;
        return insertedId;

    } catch (error) {
        // Se ocorrer algum erro, imprime no console e lança o erro novamente
        console.error('Erro ao registrar o veículo:', error);
        throw error; // Lança o erro para ser tratado fora da função

    } finally {
        // Fecha a conexão com o banco de dados, caso ela tenha sido estabelecida
        if (connection) {
            await connection.end();
        }
    }
}

async function updateRegisterVehicle(idRegisterVehicle, volumeSize, carBrand, carModel, carLicensePlate, maximumWeight){
   
    const connection = await mysql.createConnection(databaseConfig);

    const updateRegisterVehicle = "UPDATE RegisterVehicle SET volumeSize = ?, carBrand = ?, carModel = ?, carLicensePlate = ?, maximumWeight = ? WHERE idRegisterVehicle = ?";

    await connection.query(updateRegisterVehicle,[volumeSize, carBrand, carModel, carLicensePlate, maximumWeight, idRegisterVehicle]);

    await connection.end();
}

async function deleteRegisterVehicle (idRegisterVehicle){
    
    const connection = await mysql.createConnection(databaseConfig);

    await connection.query("DELETE FROM registerVehicle WHERE idRegisterVehicle = ?", [idRegisterVehicle])

    await connection.end();
}

async function getAllRegisterVehicleById(idRegisterVehicle){
    
    const connection = await mysql.createConnection(databaseConfig);

    const [registerVehicle] = await connection.query(`SELECT * FROM
        registerVehicle WHERE idRegisterVehicle = ?`, [idRegisterVehicle]);

    await connection.end();
    
    return registerVehicle;
}

async function getVehicleCount(idCollector) {
  const connection = await mysql.createConnection(databaseConfig);

  const [rows] = await connection.query(`
    SELECT COUNT(*) AS totalVehiclesRegistered 
    FROM registerVehicle 
    WHERE idCollector = ?;
  `, [idCollector]);

  await connection.end();
  return rows[0];
}

module.exports = {
    getAllRegisterVehicle,
    createRegisterVehicle,
    updateRegisterVehicle,
    deleteRegisterVehicle,
    getAllRegisterVehicleById,
    getVehicleCount,
};

