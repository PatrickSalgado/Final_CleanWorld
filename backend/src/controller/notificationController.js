const notification = require('../service/wasteTypeService.js');
const jwt = require("jsonwebtoken");
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;

async function getAllNotification(req, res) {
    try {
        const rows = await notification.getAllNotification();
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).send({
            message: "Error getting residuo",
            body: error.message,
        });
    }
}

async function createNotification(req, res) {
    const { id_notificacao, id_solicitacao_descarte, destinatario, tipo, mensagem, data_envio } = req.body;
    try {
        await notification.createNotification(id_notificacao, id_solicitacao_descarte, destinatario, tipo, mensagem, data_envio);
        res.status(201).json({ message: "Sucess" });
    } catch (error) {
        res.status(500).send({
            message: "Error adding notification!",
            error: error.message
        });
    }
}

async function updateNotification(req, res) {
    try {
        const { id_notificacao, id_solicitacao_descarte, destinatario, tipo, mensagem, data_envio } = req.body;

        await notification.updateNotification(id_notificacao, id_solicitacao_descarte, destinatario, tipo, mensagem, data_envio);

        res.status(201).json({ message: "Sucess" });
    } catch (error) {
        res.status(500).send({
            message: "Error updating notification!",
            body: error.message,
        })
    }
}

async function deleteNotification(req, res) {
    try {
        const { id_notificacao  } = req.params;

        await notification.deleteNotification(id_notificacao );

        res.status(201).json({ message: "Sucess" });
    } catch (error) {
        res.status(500).send({
            message: "Error updating residuo",
            body: error.message,
        })
    }
}

async function getNotificationById(req, res) {
    const { id_notificacao  } = req.params; // 🔥 Agora ela é visível no catch também

    try {
        if (!id_notificacao  || isNaN(id_notificacao )) {
            return res.status(400).json({ message: 'ID da notificação inválido' });
        }

        const coletor = await notification.getNotificationById(id_notificacao );
        if (!coletor) {
            return res.status(404).json({ message: 'Notificação não encontrada' });
        }

        res.status(200).json([coletor]);
    } catch (error) {
        console.error(`Erro ao buscar Notificação ${id_notificacao }:`, error); // ✅ Agora funciona
        res.status(500).json({
            message: 'Erro ao buscar Notificação',
            error: error.message,
        });
    }
}

module.exports = {
    getAllNotification,
    createNotification,
    updateNotification,
    deleteNotification,
    getNotificationById,
}