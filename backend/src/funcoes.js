import { db, linhaParaObjeto } from "./banco.js";

function buscarClientePorLogin(login) {
  const registro = db.prepare("SELECT * FROM cliente WHERE login = ?").get(login);
  return linhaParaObjeto(registro);
}

function dadosPublicos(cliente) {
  if (!cliente) {
    return null;
  }
  return {
    id: cliente.id,
    login: cliente.login,
    nome: cliente.nome,
    cpf: cliente.cpf,
    dataNascimento: cliente.data_nascimento,
    telefone: cliente.telefone,
    estadoCivil: cliente.estado_civil,
    escolaridade: cliente.escolaridade,
  };
}

/**
 * Autenticação.
 * Lê o cliente pelo login e compara a senha gravada com a senha recebida.
 * Retorna true ou false, como pede a especificação.
 */
export function autenticar(login, senha) {
  const cliente = buscarClientePorLogin(login);
  if (!cliente) {
    return false;
  }
  return cliente.senha === senha;
}

export function obterClientePorLogin(login) {
  return dadosPublicos(buscarClientePorLogin(login));
}

/**
 * Troca de senha.
 * Autentica com o login e a senha atual. Se for válida, grava a nova senha.
 * Retorna null (void) em caso de sucesso, ou uma mensagem de erro.
 */
export function trocarSenha(login, senhaAtual, novaSenha) {
  if (!autenticar(login, senhaAtual)) {
    return "Login ou senha atual inválidos.";
  }
  if (!novaSenha) {
    return "Informe a nova senha.";
  }

  const resultado = db
    .prepare("UPDATE cliente SET senha = ? WHERE login = ?")
    .run(novaSenha, login);

  if (Number(resultado.changes) !== 1) {
    return "Não foi possível trocar a senha.";
  }
  return null;
}

/**
 * Cadastro de cliente.
 * A especificação pede para verificar apenas se o login já existe.
 * Retorna null (void) em caso de sucesso, ou uma mensagem de erro.
 */
export function cadastrarCliente(dados) {
  const login = String(dados.login ?? "").trim();
  if (buscarClientePorLogin(login)) {
    return "Já existe um cliente cadastrado com este login.";
  }

  try {
    db.prepare(`
      INSERT INTO cliente (
        login, senha, nome, cpf, data_nascimento, telefone, estado_civil, escolaridade
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      login,
      String(dados.senha ?? ""),
      String(dados.nome ?? "").trim(),
      String(dados.cpf ?? "").trim(),
      String(dados.dataNascimento ?? ""),
      String(dados.telefone ?? "").trim(),
      String(dados.estadoCivil ?? ""),
      String(dados.escolaridade ?? "")
    );
  } catch {
    return "Não foi possível cadastrar o cliente. Verifique se todos os dados foram enviados.";
  }
  return null;
}

/**
 * Cadastro de serviço de TI.
 * A chave primária é gerada pelo banco (inteiro autoincremento).
 * Retorna null (void) em caso de sucesso, ou uma mensagem de erro.
 */
export function cadastrarServico(dados) {
  const nome = String(dados.nome ?? "").trim();
  const preco = Number(dados.preco);
  const prazoDias = Number(dados.prazoDias);

  if (!nome) {
    return "Informe o nome do serviço de TI.";
  }
  if (!Number.isFinite(preco) || preco <= 0) {
    return "Informe um preço maior que zero.";
  }
  if (!Number.isInteger(prazoDias) || prazoDias <= 0) {
    return "Informe um prazo de atendimento inteiro, em dias, maior que zero.";
  }

  try {
    db.prepare(
      "INSERT INTO servico_ti (nome, preco, prazo_dias) VALUES (?, ?, ?)"
    ).run(nome, preco, prazoDias);
  } catch {
    return "Não foi possível cadastrar o serviço de TI.";
  }
  return null;
}

/** Consulta de serviços de TI. Lê e retorna todos os registros. */
export function listarServicos() {
  return db
    .prepare(`
      SELECT id, nome, preco, prazo_dias AS prazoDias
      FROM servico_ti
      ORDER BY id
    `)
    .all()
    .map((registro) => ({ ...registro }));
}

/**
 * Consulta as solicitações de um usuário.
 * Recebe o login, localiza o cliente e devolve a lista (ou um erro).
 */
export function listarSolicitacoes(login) {
  const cliente = buscarClientePorLogin(String(login ?? "").trim());
  if (!cliente) {
    return { erro: "Cliente não encontrado.", dados: [] };
  }

  const dados = db
    .prepare(`
      SELECT
        s.id,
        s.data_pedido AS dataPedido,
        s.status,
        s.preco,
        s.data_prevista AS dataPrevista,
        s.servico_id AS servicoId,
        sv.nome AS nomeServico
      FROM solicitacao_servico s
      INNER JOIN servico_ti sv ON sv.id = s.servico_id
      WHERE s.cliente_id = ?
      ORDER BY s.data_pedido ASC, s.id ASC
    `)
    .all(cliente.id)
    .map((registro) => ({ ...registro }));

  return { erro: null, dados };
}

/**
 * Atualização das solicitações de um usuário.
 * Apaga todas as solicitações atuais daquele cliente e inclui a lista recebida.
 * Retorna null (void) em caso de sucesso, ou uma mensagem de erro.
 */
export function atualizarSolicitacoes(login, lista) {
  const cliente = buscarClientePorLogin(String(login ?? "").trim());
  if (!cliente) {
    return "Cliente não encontrado.";
  }
  if (!Array.isArray(lista)) {
    return "Envie a lista de solicitações do usuário.";
  }

  const normalizadas = [];
  for (const item of lista) {
    const servicoId = Number(item?.servicoId);
    const servico = db.prepare("SELECT id FROM servico_ti WHERE id = ?").get(servicoId);
    if (!servico) {
      return "A lista contém um serviço de TI que não existe.";
    }

    const dataPedido = String(item?.dataPedido ?? "");
    const dataPrevista = String(item?.dataPrevista ?? "");
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dataPedido) || !/^\d{4}-\d{2}-\d{2}$/.test(dataPrevista)) {
      return "A lista contém uma data inválida.";
    }

    const preco = Number(item?.preco);
    if (!Number.isFinite(preco) || preco < 0) {
      return "A lista contém um preço inválido.";
    }

    const idBruto = item?.id;
    const id = idBruto === null || idBruto === undefined || idBruto === "" ? null : Number(idBruto);
    if (id !== null && (!Number.isInteger(id) || id <= 0)) {
      return "A lista contém um número de solicitação inválido.";
    }

    const status = String(item?.status ?? "").trim() || "EM ELABORAÇÃO";
    normalizadas.push({ id, servicoId, dataPedido, dataPrevista, preco, status });
  }

  const idsInformados = normalizadas.filter((item) => item.id !== null).map((item) => item.id);
  if (new Set(idsInformados).size !== idsInformados.length) {
    return "A lista contém números de solicitação repetidos.";
  }
  for (const id of idsInformados) {
    const dono = db.prepare("SELECT cliente_id FROM solicitacao_servico WHERE id = ?").get(id);
    if (dono && Number(dono.cliente_id) !== Number(cliente.id)) {
      return "A lista contém um número de solicitação de outro cliente.";
    }
  }

  const apagar = db.prepare("DELETE FROM solicitacao_servico WHERE cliente_id = ?");
  const incluir = db.prepare(`
    INSERT INTO solicitacao_servico (
      cliente_id, servico_id, data_pedido, status, preco, data_prevista
    ) VALUES (?, ?, ?, ?, ?, ?)
  `);
  const incluirComId = db.prepare(`
    INSERT INTO solicitacao_servico (
      id, cliente_id, servico_id, data_pedido, status, preco, data_prevista
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  db.exec("BEGIN");
  try {
    apagar.run(cliente.id);
    for (const item of normalizadas) {
      if (item.id === null) {
        incluir.run(
          cliente.id,
          item.servicoId,
          item.dataPedido,
          item.status,
          item.preco,
          item.dataPrevista
        );
      } else {
        incluirComId.run(
          item.id,
          cliente.id,
          item.servicoId,
          item.dataPedido,
          item.status,
          item.preco,
          item.dataPrevista
        );
      }
    }
    db.exec("COMMIT");
  } catch {
    db.exec("ROLLBACK");
    return "Não foi possível atualizar as solicitações.";
  }
  return null;
}
