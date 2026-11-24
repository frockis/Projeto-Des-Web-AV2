import cors from "cors";
import express from "express";
import { rotas } from "./rotas.js";

const app = express();
const porta = 3001;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    projeto: "NovaTech AV2",
    mensagem: "API no ar. O site em React é o endereço mostrado no terminal do frontend, em geral http://localhost:5173.",
  });
});

app.use("/api", rotas);

app.use((erro, req, res, next) => {
  console.error(erro);
  res.status(500).json({
    status: "erro",
    mensagem: "Erro interno no servidor.",
  });
});

app.listen(porta, () => {
  console.log(`API NovaTech em http://localhost:${porta}`);
  console.log("Cliente de demonstração: ana.ferreira@exemplo.com / Senha@123");
});
