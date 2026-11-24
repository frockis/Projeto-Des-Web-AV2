-- Tabelas da AV2. O arquivo do banco é criado em backend/dados/novatech.sqlite.

-- Cliente: dados cadastrais, login e senha.
-- O id é a chave primária. O login é único porque a autenticação busca o cliente por ele.
CREATE TABLE IF NOT EXISTS cliente (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  login TEXT NOT NULL UNIQUE,
  senha TEXT NOT NULL,
  nome TEXT NOT NULL,
  cpf TEXT NOT NULL,
  data_nascimento TEXT NOT NULL,
  telefone TEXT,
  estado_civil TEXT NOT NULL,
  escolaridade TEXT NOT NULL
);

-- Serviço de TI. A especificação pede chave primária inteira de autoincremento.
CREATE TABLE IF NOT EXISTS servico_ti (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  preco REAL NOT NULL,
  prazo_dias INTEGER NOT NULL
);

-- Solicitação de serviço de TI.
-- Duas chaves estrangeiras: o serviço solicitado e o cliente que pediu.
CREATE TABLE IF NOT EXISTS solicitacao_servico (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  cliente_id INTEGER NOT NULL,
  servico_id INTEGER NOT NULL,
  data_pedido TEXT NOT NULL,
  status TEXT NOT NULL,
  preco REAL NOT NULL,
  data_prevista TEXT NOT NULL,
  FOREIGN KEY (cliente_id) REFERENCES cliente (id),
  FOREIGN KEY (servico_id) REFERENCES servico_ti (id)
);
