const mysql = require("mysql2/promise");
const databaseConfig = require("../config/database.js");

async function createCompanyWasteTable() {

    try {
        const connection = await mysql.createConnection(databaseConfig);

        await connection.query(`USE ${databaseConfig.database}`);

        await connection.query(`CREATE TABLE IF NOT EXISTS empresa_residuo  (
        id_empresa_coletora INT,
        id_tipo_residuo INT
    )`);

        await connection.end();

        console.log(`Table CompanyWaste created !`);
    } catch (error) {
        console.log(`Error creating table: ${error}`);
    }
};

createCompanyWasteTable();