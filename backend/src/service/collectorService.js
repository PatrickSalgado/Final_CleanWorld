const mysql = require("mysql2/promise");
const databaseConfig = require("../config/database.js");
const bcrypt = require("bcrypt");


async function getAllCollector(){
    const connection = await mysql.createConnection(databaseConfig);

    const [rows] = await connection.query(`SELECT
    SELECT 
      idCollector,
      nameEnterprise,
      cnpj,
      phone,
      userType,
      email
    FROM collector
    `);
    await connection.end();
    return rows;
}

async function createCollector(nameEnterprise, cnpj, phone, userType, email, password){
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const connection = await mysql.createConnection(databaseConfig);

    const insertcollector = "INSERT INTO collector(nameEnterprise, cnpj, phone ,userType, email, password) values (?,?,?,?,?,?)";

    await connection.query(insertcollector, [nameEnterprise, cnpj, phone,userType, email, passwordHash])
    await connection.end();
}

async function updateCollector(idCollector, nameEnterprise, cnpj, phone, userType, email, password) {
  const connection = await mysql.createConnection(databaseConfig);

  let query, params;

  if (password && password.trim() !== "") {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    query = `
      UPDATE collector 
      SET nameEnterprise = ?, cnpj = ?, phone = ?, userType = ?, email = ?, password = ?
      WHERE idCollector = ?
    `;
    params = [nameEnterprise, cnpj, phone, userType || 2, email, passwordHash, idCollector];
  } else {
    query = `
      UPDATE collector 
      SET nameEnterprise = ?, cnpj = ?, phone = ?, userType = ?, email = ?
      WHERE idCollector = ?
    `;
    params = [nameEnterprise, cnpj, phone, userType || 2, email, idCollector];
  }

  await connection.query(query, params);
  await connection.end();
}



async function deleteCollector (idCollector){
    
    const connection = await mysql.createConnection(databaseConfig);

    await connection.query("DELETE FROM coletor WHERE id = ?", [idCollector])

    await connection.end();
}

async function getCollectorById(idCollector) {
  const connection = await mysql.createConnection(databaseConfig);
  try {
    console.log('Consultando coletor com ID:', idCollector);
    const [coletor] = await connection.query(`
      SELECT
    collector.idCollector,
    collector.nameEnterprise,
    collector.cnpj,
    collector.phone,
    collector.userType,
    collector.email,
    collector.password
    FROM collector
    WHERE idCollector = ?`, [idCollector]);

    if (coletor.length === 0) {
      return null;
    }

    return coletor[0];
  } catch (error) {
    console.error(`Erro ao buscar coletor ${idCollector}:`, error);
    throw new Error('Erro ao consultar o banco de dados');
  } finally {
    await connection.end();
  }
}

async function validateLogin(email, password) {
    const connection = await mysql.createConnection(databaseConfig);
    const [collector] = await connection.query("SELECT * FROM collector WHERE email = ?", [email]);   

    if (collector.length === 0) {
        await connection.end(); 
        return null;
    }

    const isPasswordValid = await bcrypt.compare(password, collector[0].password);
    await connection.end();

    if (isPasswordValid) {
        return collector;
    } else {
        return null;
    }
}



module.exports = {
    getAllCollector,
    createCollector,
    updateCollector,
    deleteCollector,
    getCollectorById,
    validateLogin,
};

