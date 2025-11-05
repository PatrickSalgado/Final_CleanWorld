const mysql = require("mysql2/promise");
const databaseConfig = require("../config/database.js");

async function createTableRegisterVehicle(){

    try{
    const connection = await mysql.createConnection(databaseConfig);

    await connection.query(`USE ${databaseConfig.database}`);

    await connection.query(`CREATE TABLE IF NOT EXISTS registerVehicle(
        idRegisterVehicle INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        volumeSize VARCHAR(100) NOT NULL,
        carBrand VARCHAR(45) NOT NULL,
        carModel VARCHAR(45) NOT NULL,
        carLicensePlate VARCHAR(45) NOT NULL UNIQUE,
        maximumWeight INT NOT NULL,
        idCollector INT,
        FOREIGN KEY (idCollector) REFERENCES registerVehicle(idRegisterVehicle)
        );`);
    await connection.end();
    console.log(`Table RegisterVehicle created`);

    }catch(error){
        console.log(`Error creating table: ${error}`);
    }
};

createTableRegisterVehicle();