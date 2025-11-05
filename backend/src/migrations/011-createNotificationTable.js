const mysql = require("mysql2/promise");
const databaseConfig = require("../config/database.js");

async function createNotificationTable(){
    
    try{
        const connection = await mysql.createConnection(databaseConfig);

        await connection.query(`USE ${databaseConfig.database}`);

        await connection.query(`
        CREATE TABLE IF NOT EXISTS notificacao(
            id_notificacao INT PRIMARY KEY,
            id_solicitacao_descarte INT,
            destinatario VARCHAR(50),
            tipo VARCHAR(50),
            mensagem VARCHAR(150),
            data_envio DATETIME
        )
    `);

        await connection.end();

        console.log(`Table Notification created !`);
    }catch(error){
        console.log(`Error creating table: ${error}`);
    }
};

createNotificationTable();