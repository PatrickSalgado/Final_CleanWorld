const companyWaste = require('../service/companyWasteService.js');
const jwt = require("jsonwebtoken");
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;

async function getAllCompanyWaste(req, res) {
    try {
        const rows = await companyWaste.getAllCompanyWaste();
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).send({
            message: "Error getting residuo",
            body: error.message,
        });
    }
}

async function createCompanyWaste(req, res) {
    const { id_empresa_coletora, id_tipo_residuo } = req.body;
    try {
        await companyWaste.createCompanyWaste(id_empresa_coletora, id_tipo_residuo);
        res.status(201).json({ message: "Sucess" });
    } catch (error) {
        res.status(500).send({
            message: "Error adding user!",
            error: error.message
        });
    }
}

async function updateCompanyWaste(req, res) {
    try {
        const { id_empresa_coletora } = req.params;
        const { id_tipo_residuo } = req.body;

        await companyWaste.updateCompanyWaste(id_empresa_coletora, id_tipo_residuo);

        res.status(201).json({ message: "Sucess" });
    } catch (error) {
        res.status(500).send({
            message: "Error updating residuo",
            body: error.message,
        })
    }
}

async function deleteCompanyWaste(req, res) {
    try {
        const { id_empresa_coletora  } = req.params;

        await companyWaste.deleteCompanyWaste(id_empresa_coletora );

        res.status(201).json({ message: "Sucess" });
    } catch (error) {
        res.status(500).send({
            message: "Error updating residuo",
            body: error.message,
        })
    }
}

async function getCompanyWasteById(req, res) {
    const { id_empresa_coletora  } = req.params; // 🔥 Agora ela é visível no catch também

    try {
        if (!id_empresa_coletora  || isNaN(id_empresa_coletora )) {
            return res.status(400).json({ message: 'ID do residuo inválido' });
        }

        const coletor = await companyWaste.getCompanyWasteById(id_empresa_coletora );
        if (!coletor) {
            return res.status(404).json({ message: 'Residuo não encontrado' });
        }

        res.status(200).json([coletor]);
    } catch (error) {
        console.error(`Erro ao buscar coletor ${id_empresa_coletora }:`, error); // ✅ Agora funciona
        res.status(500).json({
            message: 'Erro ao buscar coletor',
            error: error.message,
        });
    }
}

module.exports = {
    getAllCompanyWaste,
    createCompanyWaste,
    updateCompanyWaste,
    deleteCompanyWaste,
    getCompanyWasteById,
}