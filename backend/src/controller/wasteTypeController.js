const jwt = require("jsonwebtoken");
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;

async function getAllWasteType(req, res) {
    try {
        const rows = await wasteType.getAllwasteType(); // <-- aqui
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).send({
            message: "Error getting residuo",
            body: error.message,
        });
    }
}

async function createWasteType(req, res) {
    const { id_tipo_residuo, descricao } = req.body;
    try {
        await wasteType.createWasteType(id_tipo_residuo, descricao);
        res.status(201).json({ message: "Sucess" });
    } catch (error) {
        res.status(500).send({
            message: "Error adding user!",
            error: error.message
        });
    }
}

async function updateWasteType(req, res) {
    try {
        const { id_tipo_residuo, descricao } = req.body;

        await wasteType.updateWasteType(id_tipo_residuo, descricao);

        res.status(201).json({ message: "Sucess" });
    } catch (error) {
        res.status(500).send({
            message: "Error updating residuo",
            body: error.message,
        })
    }
}

async function deleteWasteType(req, res) {
    try {
        const { id_tipo_residuo } = req.params;

        await wasteType.deleteWasteType(id_tipo_residuo);

        res.status(201).json({ message: "Sucess" });
    } catch (error) {
        res.status(500).send({
            message: "Error updating residuo",
            body: error.message,
        })
    }
}

async function getWasteTypeById(req, res) {
    const { id_tipo_residuo } = req.params; // 🔥 Agora ela é visível no catch também

    try {
        if (!id_tipo_residuo || isNaN(id_tipo_residuo)) {
            return res.status(400).json({ message: 'ID do residuo inválido' });
        }

        const coletor = await wasteType.getWasteTypeById(id_tipo_residuo);
        if (!coletor) {
            return res.status(404).json({ message: 'Residuo não encontrado' });
        }

        res.status(200).json([coletor]);
    } catch (error) {
        console.error(`Erro ao buscar coletor ${id_tipo_residuo}:`, error); // ✅ Agora funciona
        res.status(500).json({
            message: 'Erro ao buscar coletor',
            error: error.message,
        });
    }
}

module.exports = {
    getAllWasteType,
    createWasteType,
    updateWasteType,
    deleteWasteType,
    getWasteTypeById,
}