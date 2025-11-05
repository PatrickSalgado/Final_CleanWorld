const mysql = require("mysql2/promise");
const databaseConfig = require("../config/database.js");

async function getAllNotification() {
    const connection = await mysql.createConnection(databaseConfig);

    const [rows] = await connection.query(`SELECT
    notificacao . id_notificacao,
    notificacao .id_solicitacao_descarte ,
    notificacao .destinatario  ,
    notificacao .tipo   ,
    notificacao .mensagem    ,
    notificacao .data_envio     ,
    `);
    await connection.end();
    return rows;
}

async function createNotification(id_notificacao , id_solicitacao_descarte ,destinatario,tipo ,mensagem,data_envio) {
    const connection = await mysql.createConnection(databaseConfig);

    const insertwasteType = "INSERT INTO tipo_residuo(id_notificacao , id_solicitacao_descarte ,destinatario,tipo ,mensagem,data_envio) values (?,?,?,?,?,?)";

    await connection.query(insertwasteType, [id_notificacao , id_solicitacao_descarte ,destinatario,tipo ,mensagem,data_envio]);
    await connection.end();
}

async function updateNotification(id_notificacao , id_solicitacao_descarte ,destinatario,tipo ,mensagem,data_envio) {
    const connection = await mysql.createConnection(databaseConfig);

    const updateNotification = "UPDATE tipo_residuo ,id_notificacao , id_solicitacao_descarte, destinatario, tipo, mensagem, data_envio SET id_notificacao = ?, id_solicitacao_descarte= ?, destinatario= ?, tipo= ?, mensagem= ?, data_envio= ? WHERE id_tipo_residuo = ?";

    await connection.query(updateNotification, [id_notificacao , id_solicitacao_descarte ,destinatario,tipo ,mensagem,data_envio]);

    await connection.end();
}

async function deleteNotification(id_notificacao ) {

    const connection = await mysql.createConnection(databaseConfig);

    await connection.query("DELETE FROM notificacao  WHERE id_notificacao  = ?", [id_notificacao ])

    await connection.end();
}

async function getNotificationById(id_notificacao) {
    const connection = await mysql.createConnection(databaseConfig);
    try {
        console.log('Consultando coletor com ID:', id_notificacao );
        const [coletor] = await connection.query(`
      SELECT
        notificacao.id_notificacao ,
        notificacao.descricao
        WHERE id_notificacao = ?`, [id_notificacao]);

        if (coletor.length === 0) {
            return null;
        }

        return coletor[0];
    } catch (error) {
        console.error(`Erro ao buscar coletor ${id_notificacao}:`, error);
        throw new Error('Erro ao consultar o banco de dados');
    } finally {
        await connection.end();
    }
}

module.exports = {
    getAllNotification,
    createNotification,
    updateNotification,
    deleteNotification,
    getNotificationById,
};

