const mysql = require("mysql2/promise");
const databaseConfig = require("../config/database.js");
const bcrypt = require("bcrypt");

async function validateLogin(email, password) {
    console.log("=== [validateLogin - service] Iniciando ===");
    console.log("Email recebido:", email);
    console.log("Senha recebida (texto):", password);

    const connection = await mysql.createConnection(databaseConfig);
    console.log("Conexão com MySQL estabelecida.");

    // Consulta ao banco
    const [user] = await connection.query(
        "SELECT * FROM user WHERE email = ?",
        [email]
    );
    console.log("Resultado da query:", user);

    // Verifica se encontrou usuário
    if (user.length === 0) {
        console.log("Nenhum usuário encontrado com esse email.");
        await connection.end();
        return null;
    }

    // Compara a senha com o hash do banco
    const isPasswordValid = await bcrypt.compare(password, user[0].password);
    console.log("Senha válida?", isPasswordValid);

    await connection.end();
    console.log("Conexão MySQL encerrada.");

    if (isPasswordValid) {
        console.log("Usuário validado com sucesso:", user[0].idUser);
        return user;
    } else {
        console.log("Senha incorreta para o email:", email);
        return null;
    }
}

module.exports = {
    validateLogin
};
