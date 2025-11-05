const mysql = require("mysql2/promise");
const databaseConfig = require("../config/database.js");

async function createWasteTypeTable() {
    try {
        const connection = await mysql.createConnection(databaseConfig);

        await connection.query(`USE ${databaseConfig.database}`);

        await connection.query(`
            CREATE TABLE IF NOT EXISTS tipo_residuo (
                id_tipo_residuo INT PRIMARY KEY,
                descricao VARCHAR(150)
            )
        `);

        await connection.end();

        console.log(`Waste Table created !`);
    } catch (error) {
        console.log(`Error creating table: ${error}`);
    }
};

module.exports = createWasteTypeTable();