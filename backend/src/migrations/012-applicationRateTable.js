const mysql = require("mysql2/promise");
const databaseConfig = require("../config/database.js");

async function applicationRateTable() {

    try {
        const connection = await mysql.createConnection(databaseConfig);

        await connection.query(`USE ${databaseConfig.database}`);

        await connection.query(`   
            CREATE TABLE IF NOT EXISTS avaliacao(
                id_avaliacao INT PRIMARY KEY,
                id_solicitacao INT,
                id_empresa INT,
                nota INT,
                comentario TEXT,
                data_avaliacao DATETIME
                )`);

        await connection.end();

        console.log(`Table applicationRate created !`);
    } catch (error) {
        console.log(`Error creating table: ${error}`);
    }
};

applicationRateTable();