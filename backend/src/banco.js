import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { DatabaseSync } from "node:sqlite";

const pastaSrc = path.dirname(fileURLToPath(import.meta.url));
const pastaDados = path.resolve(pastaSrc, "../dados");
const arquivoBanco = path.join(pastaDados, "novatech.sqlite");

fs.mkdirSync(pastaDados, { recursive: true });

export const db = new DatabaseSync(arquivoBanco);
db.exec("PRAGMA foreign_keys = ON");
db.exec(fs.readFileSync(path.join(pastaSrc, "esquema.sql"), "utf8"));

function contar(tabela) {
  const linha = db.prepare(`SELECT COUNT(*) AS total FROM ${tabela}`).get();
  return Number(linha.total);
}

function semear() {
  const incluirServico = db.prepare(
    "INSERT INTO servico_ti (nome, preco, prazo_dias) VALUES (?, ?, ?)"
  );
  const servicosIniciais = [
    ["Suporte técnico mensal", 450, 7],
    ["Instalação de rede Wi-Fi", 1200, 15],
    ["Backup em nuvem", 290, 7],
    ["Configuração de firewall", 780, 10],
    ["Desenvolvimento de site institucional", 3500, 30],
    ["Adequação à LGPD", 2200, 45],
  ];

  const incluirCliente = db.prepare(`
    INSERT INTO cliente (
      login, senha, nome, cpf, data_nascimento, telefone, estado_civil, escolaridade
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const incluirSolicitacao = db.prepare(`
    INSERT INTO solicitacao_servico (
      id, cliente_id, servico_id, data_pedido, status, preco, data_prevista
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  db.exec("BEGIN");
  try {
    for (const servico of servicosIniciais) {
      incluirServico.run(...servico);
    }

    const cliente = incluirCliente.run(
      "ana.ferreira@exemplo.com",
      "Senha@123",
      "Ana Paula Ferreira",
      "529.982.247-25",
      "1990-03-20",
      "(81) 98888-1234",
      "Casado(a)",
      "Nível superior"
    );
    const clienteId = Number(cliente.lastInsertRowid);

    const backup = db.prepare("SELECT id FROM servico_ti WHERE nome = ?").get("Backup em nuvem");
    const suporte = db.prepare("SELECT id FROM servico_ti WHERE nome = ?").get("Suporte técnico mensal");
    const wifi = db.prepare("SELECT id FROM servico_ti WHERE nome = ?").get("Instalação de rede Wi-Fi");

    incluirSolicitacao.run(1001, clienteId, Number(backup.id), "2026-07-14", "CONCLUÍDO", 290, "2026-07-21");
    incluirSolicitacao.run(1002, clienteId, Number(suporte.id), "2026-08-30", "EM ANDAMENTO", 450, "2026-09-06");
    incluirSolicitacao.run(1003, clienteId, Number(wifi.id), "2026-09-25", "EM ANDAMENTO", 1200, "2026-10-10");

    db.exec("COMMIT");
  } catch (erro) {
    db.exec("ROLLBACK");
    throw erro;
  }
}

if (contar("servico_ti") === 0 && contar("cliente") === 0) {
  semear();
}

export function linhaParaObjeto(registro) {
  return registro ? { ...registro } : null;
}
