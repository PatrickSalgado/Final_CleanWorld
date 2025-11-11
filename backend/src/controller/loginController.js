require("dotenv").config();
const loginService = require("../service/loginService.js");
const jwt = require("jsonwebtoken");

console.log("JWT_SECRET =>", process.env.JWT_SECRET);
const JWT_SECRET = process.env.JWT_SECRET;

async function validateLogin(req, res) {
  try {
    console.log("JWT_SECRET:", JWT_SECRET);

    console.log("=== [validateLogin] Iniciando ===");
    console.log("Body recebido:", req.body);

    const { email, password } = req.body;
    console.log("Email:", email);
    console.log("Password (texto recebido):", password);

    const validatedUser = await loginService.validateLogin(email, password);
    console.log("validatedUser retornado:", validatedUser);

    // Se não encontrar usuário ou senha inválida
    if (!validatedUser || validatedUser.length === 0) {
      console.log("Nenhum usuário validado, retornando 401");
      return res.status(401).send({
        message: "Usuário não encontrado ou senha inválida",
      });
    }

    const idUser = validatedUser[0].idUser;
    const userType = validatedUser[0].userType;
    console.log("idUser:", idUser, "userType:", userType);

    const token = jwt.sign({ idUser, userType }, JWT_SECRET);
    console.log("Token gerado:", token);

    res.status(200).json({ auth: true, token, userType, idUser });
  } catch (error) {
    console.error("Erro em validateLogin:", error);
    res.status(401).send({
      message: "Error getting user!",
      body: error.message,
    });
  }
}

const routeConfirmation = async (req, res) => {
  console.log("=== [routeConfirmation] Testando a rota ===");
  res.status(200).json({ message: "Welcome" });
};

module.exports = {
  validateLogin,
  routeConfirmation,
};
