import { Router } from "express";
import {
  atualizarSolicitacoes,
  autenticar,
  cadastrarCliente,
  cadastrarServico,
  listarServicos,
  listarSolicitacoes,
  obterClientePorLogin,
  trocarSenha,
} from "./funcoes.js";

export const rotas = Router();

function sucesso(res, extra = {}) {
  res.json({ status: "sucesso", mensagem: "", ...extra });
}

function erro(res, mensagem, codigo = 400, extra = {}) {
  res.status(codigo).json({ status: "erro", mensagem, ...extra });
}

/** Autenticação. Entrada: login e senha. Retorno: status do login. */
rotas.post("/autenticacao", (req, res) => {
  const login = String(req.body?.login ?? "").trim();
  const senha = String(req.body?.senha ?? "");

  if (!login || !senha) {
    return erro(res, "Informe login e senha.", 400, { autenticado: false });
  }

  const autenticado = autenticar(login, senha);
  if (!autenticado) {
    return erro(res, "Login ou senha inválidos.", 401, { autenticado: false });
  }

  const cliente = obterClientePorLogin(login);
  return sucesso(res, {
    autenticado: true,
    login: cliente.login,
    nome: cliente.nome,
  });
});

/** Troca de senha. Entrada: login, senha atual e nova senha. */
rotas.post("/troca-senha", (req, res) => {
  const login = String(req.body?.login ?? "").trim();
  const senhaAtual = String(req.body?.senhaAtual ?? "");
  const novaSenha = String(req.body?.novaSenha ?? "");
  const mensagem = trocarSenha(login, senhaAtual, novaSenha);

  if (mensagem) {
    return erro(res, mensagem);
  }
  return sucesso(res);
});

/** Cadastro de cliente. Entrada: dados do cliente. */
rotas.post("/clientes", (req, res) => {
  const mensagem = cadastrarCliente(req.body ?? {});
  if (mensagem) {
    return erro(res, mensagem);
  }
  return sucesso(res);
});

/** Cadastro de serviço de TI. Entrada: nome, preço e prazo. */
rotas.post("/servicos", (req, res) => {
  const mensagem = cadastrarServico(req.body ?? {});
  if (mensagem) {
    return erro(res, mensagem);
  }
  return sucesso(res);
});

/** Consulta de serviços de TI. Não exige dados de entrada. */
rotas.get("/servicos", (req, res) => {
  return sucesso(res, { dados: listarServicos() });
});

/** Leitura das solicitações de um usuário. Entrada: login. */
rotas.get("/solicitacoes", (req, res) => {
  const login = String(req.query?.login ?? "").trim();
  if (!login) {
    return erro(res, "Informe o login do usuário.");
  }

  const resultado = listarSolicitacoes(login);
  if (resultado.erro) {
    return erro(res, resultado.erro, 404);
  }
  return sucesso(res, { dados: resultado.dados });
});

/**
 * Atualização das solicitações.
 * Entrada: login do usuário e a nova lista de solicitações.
 * Apaga as solicitações atuais e grava a lista recebida.
 */
rotas.put("/solicitacoes", (req, res) => {
  const login = String(req.body?.login ?? "").trim();
  const mensagem = atualizarSolicitacoes(login, req.body?.solicitacoes);
  if (mensagem) {
    return erro(res, mensagem);
  }

  const resultado = listarSolicitacoes(login);
  return sucesso(res, { dados: resultado.dados });
});
