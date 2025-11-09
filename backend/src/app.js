const express = require("express");
const cors = require("cors");

// Routers
const userRouter = require("./router/userRouter");
const collectorRouter = require("./router/collectorRouter");
const loginRouter = require("./router/loginRouter");
const registerOrderRouter = require("./router/registerOrderRouter");
const registerVehicleRouter = require("./router/registerVehicleRouter");
const wasteTypeRouter = require("./router/wasteTypeRouter");

const app = express();
const port = 8080;

/** CORS: libera tudo (ajuste depois se quiser restringir) */
app.use(cors({
  origin: "*",
  methods: "GET,POST,PUT,DELETE,OPTIONS",
  allowedHeaders: "Content-Type, Authorization"
}));

/** Garante resposta ao preflight CORS */
app.options("*", cors());

/** Body parsers corretos */
app.use(express.json());              // em vez de bodyParser.json("application/json")
app.use(express.urlencoded({ extended: true }));

/** Healthcheck */
app.get("/", (_req, res) => res.send("<h1>CleanWorld</h1>"));
app.get("/health", (_req, res) => res.status(200).json({ ok: true }));

/** Rotas */
app.use("/api", userRouter);
app.use("/api", collectorRouter);
app.use("/api", loginRouter);
app.use("/api", registerOrderRouter);
app.use("/api", registerVehicleRouter);
app.use("/api", wasteTypeRouter);

app.listen(port, () => {
  console.log(`Servidor rodando: http://localhost:${port}`);
});
