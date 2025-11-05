const mysql = require("mysql2/promise");
const databaseConfig = require("../config/database.js");
const bcrypt = require("bcrypt");


async function getAllCompanyWaste() {
    const connection = await mysql.createConnection(databaseConfig);

    const [rows] = await connection.query(`SELECT
    empresa_residuo.id_empresa_coletora ,
    empresa_residuo.id_empresa_coletora,
    `);
    await connection.end();
    return rows;
}

async function createCompanyWaste(id_empresa_coletora, id_tipo_residuo ) {
    const salt = await bcrypt.genSalt(10);
    const connection = await mysql.createConnection(databaseConfig);

    const insertCompanyWaste = "INSERT INTO tipo_residuo(id_empresa_coletora,id_tipo_residuo ) values (?,?)";

    await connection.query(insertCompanyWaste, [id_empresa_coletora, id_tipo_residuo ]);
    await connection.end();
}

async function updateCompanyWaste(id_empresa_coletora, id_tipo_residuo ) {
    const connection = await mysql.createConnection(databaseConfig);

    const updateCompanyWaste = "UPDATE tipo_residuo SET id_empresa_coletora = ?, id_tipo_residuo = ? WHERE id_empresa_coletora = ?";

    await connection.query(updateCompanyWaste, [id_empresa_coletora, id_tipo_residuo ]);

    await connection.end();
}

async function deleteColetor(id_empresa_coletora) {

    const connection = await mysql.createConnection(databaseConfig);

    await connection.query("DELETE FROM tipo_residuo WHERE id_empresa_coletora = ?", [id_empresa_coletora])

    await connection.end();
}

async function getCompanyWaste(id_empresa_coletora) {
    const connection = await mysql.createConnection(databaseConfig);
    try {
        console.log('Consultando coletor com ID:', id_empresa_coletora);
        const [company] = await connection.query(`
      SELECT
        empresa_residuo.id_empresa_coletora ,
        empresa_residuo.id_tipo_residuo  
        WHERE id_empresa_coletora  = ?`, [id_empresa_coletora]);

        if (company.length === 0) {
            return null;
        }

        return company[0];
    } catch (error) {
        console.error(`Erro ao buscar empresa ${id_empresa_coletora}:`, error);
        throw new Error('Erro ao consultar o banco de dados');
    } finally {
        await connection.end();
    }
}

module.exports = {
    getAllCompanyWaste,
    createCompanyWaste,
    updateCompanyWaste,
    deleteColetor,
    getCompanyWaste,
};

