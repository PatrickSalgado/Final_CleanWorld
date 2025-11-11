const mysql = require("mysql2/promise");
const databaseConfig = require("../config/database.js");
const bcrypt = require("bcrypt");


async function getAllwasteType() {
    const connection = await mysql.createConnection(databaseConfig);

    const [rows] = await connection.query(`
        SELECT id_tipo_residuo, descricao 
        FROM tipo_residuo
    `);
    await connection.end();
    return rows;
}

async function createwasteType(id_tipo_residuo, descricao) {
    const connection = await mysql.createConnection(databaseConfig);

    const insertwasteType = "INSERT INTO tipo_residuo(id_tipo_residuo,descricao) values (?,?)";

    await connection.query(insertwasteType, [id_tipo_residuo, descricao]);
    await connection.end();
}

async function updatewasteType(id_tipo_residuo, descricao) {
    const connection = await mysql.createConnection(databaseConfig);

    const updatewasteType = "UPDATE tipo_residuo SET id_tipo_residuo = ?, descricao= ? WHERE id_tipo_residuo = ?";

    await connection.query(updatewasteType, [id_tipo_residuo, descricao, id_tipo_residuo]);

    await connection.end();
}

async function deleteWasteType(id_tipo_residuo) {
    const connection = await mysql.createConnection(databaseConfig);
    await connection.query("DELETE FROM tipo_residuo WHERE id_tipo_residuo = ?", [id_tipo_residuo]);
    await connection.end();
}

async function getwasteTypeById(id_tipo_residuo) {
    const connection = await mysql.createConnection(databaseConfig);
    try {
        console.log('Consultando coletor com ID:', id_tipo_residuo);
        const [coletor] = await connection.query(`
            SELECT id_tipo_residuo, descricao
            FROM tipo_residuo
            WHERE id_tipo_residuo = ?`, [id_tipo_residuo]
        );

        if (coletor.length === 0) {
            return null;
        }

        return coletor[0];
    } catch (error) {
        console.error(`Erro ao buscar coletor ${id_tipo_residuo}:`, error);
        throw new Error('Erro ao consultar o banco de dados');
    } finally {
        await connection.end();
    }
}

module.exports = {
    getAllwasteType,
    createwasteType,
    updatewasteType,
    deleteWasteType,
    getwasteTypeById,
};

