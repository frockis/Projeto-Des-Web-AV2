async function requisitar(caminho, { method = "GET", body } = {}) {
  let resposta;
  try {
    resposta = await fetch(caminho, {
      method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error("Não foi possível conectar ao servidor. Verifique se a API está em execução.");
  }

  let dados = {};
  try {
    dados = await resposta.json();
  } catch {
    dados = {};
  }

  if (!resposta.ok || dados.status === "erro") {
    throw new Error(dados.mensagem || "Não foi possível concluir a operação.");
  }
  return dados;
}

export function autenticar(login, senha) {
  return requisitar("/api/autenticacao", {
    method: "POST",
    body: { login, senha },
  });
}

export function trocarSenha(login, senhaAtual, novaSenha) {
  return requisitar("/api/troca-senha", {
    method: "POST",
    body: { login, senhaAtual, novaSenha },
  });
}

export function cadastrarCliente(cliente) {
  return requisitar("/api/clientes", {
    method: "POST",
    body: cliente,
  });
}

export function cadastrarServico(servico) {
  return requisitar("/api/servicos", {
    method: "POST",
    body: servico,
  });
}

export async function listarServicos() {
  const resposta = await requisitar("/api/servicos");
  return resposta.dados;
}

export async function listarSolicitacoes(login) {
  const resposta = await requisitar("/api/solicitacoes?login=" + encodeURIComponent(login));
  return resposta.dados;
}

export async function salvarSolicitacoes(login, solicitacoes) {
  const resposta = await requisitar("/api/solicitacoes", {
    method: "PUT",
    body: { login, solicitacoes },
  });
  return resposta.dados;
}
