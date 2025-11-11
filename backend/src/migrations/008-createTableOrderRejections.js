const mysql = require("mysql2/promise");
const databaseConfig = require("../config/database.js");

async function createTableOrderRejections() {
  try {
    const connection = await mysql.createConnection(databaseConfig);

    await connection.query(`USE ${databaseConfig.database}`);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS orderRejections (
        idRegisterOrder INT NOT NULL,
        idCollector INT NOT NULL,
        rejectionDate DATETIME DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (idRegisterOrder, idCollector),
        FOREIGN KEY (idRegisterOrder) REFERENCES registerOrder(idRegisterOrder),
        FOREIGN KEY (idCollector) REFERENCES Collector(idCollector)
      )
    `);

    await connection.end();
    console.log(`Table orderRejections created`);
  } catch (error) {
    console.log(`Error creating table: ${error}`);
  }
}

createTableOrderRejections();