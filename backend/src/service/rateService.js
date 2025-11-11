const mysql = require("mysql2/promise");
const databaseConfig = require("../config/database.js");
const bcrypt = require("bcrypt");


async function getAllRate() {
    const connection = await mysql.createConnection(databaseConfig);

    const [rows] = await connection.query(`SELECT
    avaliacao.id_tipo_residuo,
    avaliacao.id_solicitacao ,
    avaliacao.id_empresa ,
    avaliacao.nota ,
    avaliacao.comentario ,
    avaliacao.data_avaliacao ,
    `);
    await connection.end();
    return rows;
}

async function createRate(id_avaliacao , id_solicitacao,id_empresa , nota, comentario, data_avaliacao ) {
    const connection = await mysql.createConnection(databaseConfig);

    const insertRate = "INSERT INTO avaliacao(id_avaliacao , id_solicitacao,id_empresa , nota, comentario, data_avaliacao) values (?,?,?,?,?,?,?)";

    await connection.query(insertRate, [id_avaliacao , id_solicitacao,id_empresa , nota, comentario, data_avaliacao]);
    await connection.end();
}

async function updateRate(id_avaliacao , id_solicitacao,id_empresa , nota, comentario, data_avaliacao) {
    const connection = await mysql.createConnection(databaseConfig);

    const updateRate = "UPDATE id_avaliacao , id_solicitacao,id_empresa , nota, comentario, data_avaliacao SET id_avaliacao =? , id_solicitacao=? ,id_empresa=?  , nota=? , comentario=? , data_avaliacao=? ";

    await connection.query(updateRate, [id_avaliacao , id_solicitacao,id_empresa , nota, comentario, data_avaliacao]);

    await connection.end();
}

async function deleteColetor(id_avaliacao ) {

    const connection = await mysql.createConnection(databaseConfig);

    await connection.query("DELETE FROM avaliacao WHERE id_avaliacao  = ?", [id_avaliacao ])

    await connection.end();
}

async function getRate(id_avaliacao ) {
    const connection = await mysql.createConnection(databaseConfig);
    try {
        console.log('Consultando avaliacao com ID:', id_avaliacao );
        const [coletor] = await connection.query(`
      SELECT
        avaliacao.id_avaliacao ,
        avaliacao.descricao
        WHERE id_avaliacao  = ?`, [id_avaliacao ]);

        if (coletor.length === 0) {
            return null;
        }

        return coletor[0];
    } catch (error) {
        console.error(`Erro ao buscar coletor ${id_avaliacao }:`, error);
        throw new Error('Erro ao consultar o banco de dados');
    } finally {
        await connection.end();
    }
}

module.exports = {
    getAllRate,
    createRate,
    updateRate,
    deleteColetor,
    getRate,
};

