import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { cadastrarServico } from "../api";
import Mensagem from "../componentes/Mensagem";
import { interpretarPreco } from "../formato";

export default function PaginaCadastroServico() {
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [prazo, setPrazo] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [tipo, setTipo] = useState("erro");
  const [enviando, setEnviando] = useState(false);
  const refNome = useRef(null);
  const refPreco = useRef(null);
  const refPrazo = useRef(null);
  const navegar = useNavigate();

  function mostrarErro(texto, campo) {
    setTipo("erro");
    setMensagem(texto);
    campo.current?.focus();
  }

  function limpar() {
    setNome("");
    setPreco("");
    setPrazo("");
    setMensagem("");
    setTipo("erro");
    refNome.current?.focus();
  }

  function voltar() {
    if (window.history.length > 1) {
      navegar(-1);
    } else {
      navegar("/");
    }
  }

  async function incluir() {
    setMensagem("");
    const nomeLimpo = nome.trim();
    const precoNumero = interpretarPreco(preco);
    const prazoLimpo = prazo.trim();

    if (nomeLimpo === "") {
      mostrarErro("Preencha o nome do serviço.", refNome);
      return;
    }
    if (preco.trim() === "") {
      mostrarErro("Preencha o preço.", refPreco);
      return;
    }
    if (!Number.isFinite(precoNumero) || precoNumero <= 0) {
      mostrarErro("Informe um preço maior que zero. Exemplo: 450 ou 1.200,00.", refPreco);
      return;
    }
    if (prazoLimpo === "") {
      mostrarErro("Preencha o prazo de atendimento.", refPrazo);
      return;
    }
    if (!/^\d+$/.test(prazoLimpo) || Number(prazoLimpo) <= 0) {
      mostrarErro("O prazo deve ser um número inteiro de dias, maior que zero.", refPrazo);
      return;
    }

    setEnviando(true);
    try {
      await cadastrarServico({
        nome: nomeLimpo,
        preco: precoNumero,
        prazoDias: Number(prazoLimpo),
      });
      setTipo("ok");
      setMensagem("Serviço de TI cadastrado com sucesso.");
      window.alert("Serviço de TI cadastrado com sucesso.");
      setNome("");
      setPreco("");
      setPrazo("");
      refNome.current?.focus();
    } catch (erro) {
      mostrarErro(erro.message, refNome);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <main>
      <div className="painel largo">
        <Link to="/">
          <img className="logo-form" src="/img/logo-escuro.svg" alt="Logo da NovaTech Soluções em TI" />
        </Link>
        <h1>Cadastro de serviços de TI</h1>
        <p>
          Informe o nome, o preço e o prazo de atendimento. São os mesmos dados usados na página de solicitação de serviços.
        </p>

        <table className="formulario">
          <tbody>
            <tr>
              <td>
                <label htmlFor="nomeServico">Nome do serviço</label>
              </td>
              <td>
                <input
                  type="text"
                  id="nomeServico"
                  ref={refNome}
                  value={nome}
                  onChange={(evento) => setNome(evento.target.value)}
                />
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor="preco">Preço (R$)</label>
              </td>
              <td>
                <input
                  type="text"
                  id="preco"
                  ref={refPreco}
                  value={preco}
                  placeholder="450 ou 1.200,00"
                  onChange={(evento) => setPreco(evento.target.value)}
                />
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor="prazo">Prazo de atendimento (dias)</label>
              </td>
              <td>
                <input
                  type="text"
                  id="prazo"
                  ref={refPrazo}
                  value={prazo}
                  inputMode="numeric"
                  placeholder="7"
                  onChange={(evento) => setPrazo(evento.target.value)}
                />
              </td>
            </tr>
          </tbody>
        </table>

        <Mensagem texto={mensagem} tipo={tipo} />

        <div className="acoes">
          <button type="button" className="botao primario" onClick={incluir} disabled={enviando}>
            Cadastrar
          </button>
          <button type="button" className="botao" onClick={limpar}>
            Limpar
          </button>
          <button type="button" className="botao" onClick={voltar}>
            Voltar
          </button>
        </div>

        <p className="links-form">
          <Link to="/">Página inicial</Link>
          <Link to="/carrinho">Solicitar serviços</Link>
        </p>
      </div>
    </main>
  );
}
