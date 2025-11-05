const rate = require('../service/rateService.js');
const jwt = require("jsonwebtoken");
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;

async function getAllRate(req, res) {
    try {
        const rows = await rate.getAllRate();
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).send({
            message: "Error getting residuo",
            body: error.message,
        });
    }
}

async function createRate(req, res) {
    const { id_avaliacao , id_solicitacao,id_empresa , nota, comentario, data_avaliacao } = req.body;
    try {
        await rate.createRate(id_avaliacao , id_solicitacao,id_empresa , nota, comentario, data_avaliacao);
        res.status(201).json({ message: "Sucess" });
    } catch (error) {
        res.status(500).send({
            message: "Error adding rate!",
            error: error.message
        });
    }
}

async function updateRate(req, res) {
    try {
        const { id_avaliacao , id_solicitacao,id_empresa , nota, comentario, data_avaliacao } = req.body;

        await rate.updateRate(id_avaliacao , id_solicitacao,id_empresa , nota, comentario, data_avaliacao);

        res.status(201).json({ message: "Sucess" });
    } catch (error) {
        res.status(500).send({
            message: "Error updating rate!",
            body: error.message,
        })
    }
}

async function deleteRate(req, res) {
    try {
        const { id_avaliacao  } = req.params;

        await rate.deleteRate(id_avaliacao );

        res.status(201).json({ message: "Sucess" });
    } catch (error) {
        res.status(500).send({
            message: "Error updating rate!",
            body: error.message,
        })
    }
}

async function getRateById(req, res) {
    const { id_avaliacao  } = req.params; // 🔥 Agora ela é visível no catch também

    try {
        if (!id_avaliacao  || isNaN(id_avaliacao )) {
            return res.status(400).json({ message: 'ID da avaliação inválido' });
        }

        const coletor = await rate.getRateById(id_avaliacao );
        if (!coletor) {
            return res.status(404).json({ message: 'avaliação não encontrado' });
        }

        res.status(200).json([coletor]);
    } catch (error) {
        console.error(`Erro ao buscar coletor ${id_avaliacao }:`, error); // ✅ Agora funciona
        res.status(500).json({
            message: 'Erro ao buscar avaliação',
            error: error.message,
        });
    }
}

module.exports = {
    getAllRate,
    createRate,
    updateRate,
    deleteRate,
    getRateById,
}