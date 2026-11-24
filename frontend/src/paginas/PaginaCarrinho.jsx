import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { listarServicos, listarSolicitacoes, salvarSolicitacoes } from "../api";
import Cabecalho from "../componentes/Cabecalho";
import Mensagem from "../componentes/Mensagem";
import ResumoServico from "../componentes/ResumoServico";
import TabelaSolicitacoes from "../componentes/TabelaSolicitacoes";
import { useAuth } from "../contexto/AuthContext";
import { formatarDataISO, formatarMoeda, hojeISO, ordenarSolicitacoes, somarDiasISO } from "../formato";

function comChave(item) {
  return { ...item, chave: item.chave || `srv-${item.id}` };
}

export default function PaginaCarrinho() {
  const { usuario } = useAuth();
  const [servicos, setServicos] = useState([]);
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [servicoId, setServicoId] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [tipo, setTipo] = useState("erro");
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (!usuario) {
      return undefined;
    }

    let ativo = true;

    async function carregar() {
      setCarregando(true);
      try {
        const listaServicos = await listarServicos();
        const listaPedidos = await listarSolicitacoes(usuario.login);
        if (!ativo) {
          return;
        }
        setServicos(listaServicos);
        setSolicitacoes(listaPedidos.map(comChave));
        setMensagem("");
      } catch (erro) {
        if (ativo) {
          setTipo("erro");
          setMensagem(erro.message);
        }
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    }

    carregar();
    return () => {
      ativo = false;
    };
  }, [usuario]);

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  const servicoSelecionado = servicos.find((servico) => String(servico.id) === String(servicoId));
  const hoje = hojeISO();
  const preco = servicoSelecionado ? formatarMoeda(servicoSelecionado.preco) : "-";
  const prazo = servicoSelecionado ? `${servicoSelecionado.prazoDias} dias` : "-";
  const previsao = servicoSelecionado
    ? formatarDataISO(somarDiasISO(hoje, servicoSelecionado.prazoDias))
    : "-";

  function incluir() {
    if (!servicoSelecionado) {
      setTipo("erro");
      setMensagem("Selecione um serviço de TI.");
      return;
    }

    const nova = {
      chave: crypto.randomUUID(),
      id: null,
      servicoId: servicoSelecionado.id,
      nomeServico: servicoSelecionado.nome,
      dataPedido: hoje,
      status: "EM ELABORAÇÃO",
      preco: servicoSelecionado.preco,
      dataPrevista: somarDiasISO(hoje, servicoSelecionado.prazoDias),
    };

    setSolicitacoes((atual) => ordenarSolicitacoes([...atual, nova]));
    setServicoId("");
    setTipo("ok");
    setMensagem("Solicitação incluída nesta página. Clique em Atualizar solicitações para gravar no banco.");
  }

  function excluir(chave) {
    setSolicitacoes((atual) => atual.filter((item) => item.chave !== chave));
    setTipo("ok");
    setMensagem("Solicitação removida desta página. Clique em Atualizar solicitações para gravar no banco.");
  }

  async function atualizar() {
    setSalvando(true);
    try {
      const gravadas = await salvarSolicitacoes(
        usuario.login,
        solicitacoes.map((item) => ({
          id: item.id,
          servicoId: item.servicoId,
          dataPedido: item.dataPedido,
          status: item.status,
          preco: item.preco,
          dataPrevista: item.dataPrevista,
        }))
      );
      setSolicitacoes(gravadas.map(comChave));
      setTipo("ok");
      setMensagem("Solicitações atualizadas com sucesso.");
    } catch (erro) {
      setTipo("erro");
      setMensagem(erro.message);
    } finally {
      setSalvando(false);
    }
  }

  return (
    <>
      <Cabecalho titulo="Solicitação de serviços de TI" />

      <main>
        <section id="usuario" className="card destaque">
          <h2>Cliente logado</h2>
          <div className="usuario">
            <div>
              <span className="rotulo-valor">Nome</span>
              <span>{usuario.nome}</span>
            </div>
            <div>
              <span className="rotulo-valor">Login (e-mail)</span>
              <span>{usuario.login}</span>
            </div>
          </div>
        </section>

        <section id="pedidos">
          <h2>Minhas solicitações</h2>
          {carregando ? <p>Carregando solicitações...</p> : <TabelaSolicitacoes solicitacoes={solicitacoes} aoExcluir={excluir} />}
          <p className="aviso">
            Incluir e excluir mudam a lista nesta página. O botão abaixo apaga as solicitações atuais do usuário no banco e grava esta lista no lugar.
          </p>
          <div className="acoes">
            <button type="button" className="botao primario" onClick={atualizar} disabled={salvando || carregando}>
              Atualizar solicitações
            </button>
          </div>
        </section>

        <section id="nova" className="card">
          <h2>Nova solicitação</h2>
          <table className="formulario">
            <tbody>
              <tr>
                <td>
                  <label htmlFor="servico">Serviço de TI</label>
                </td>
                <td>
                  <select
                    id="servico"
                    value={servicoId}
                    onChange={(evento) => {
                      setServicoId(evento.target.value);
                      setMensagem("");
                    }}
                  >
                    <option value="">Selecione um serviço</option>
                    {servicos.map((servico) => (
                      <option key={servico.id} value={servico.id}>
                        {servico.nome}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            </tbody>
          </table>

          <ResumoServico preco={preco} prazo={prazo} previsao={previsao} />

          <Mensagem texto={mensagem} tipo={tipo} />

          <div className="acoes">
            <button type="button" className="botao primario" onClick={incluir} disabled={carregando}>
              Incluir solicitação
            </button>
          </div>
          <p className="links-form">
            <Link to="/cadastro-servico">Cadastrar um novo serviço de TI</Link>
          </p>
        </section>
      </main>
    </>
  );
}
