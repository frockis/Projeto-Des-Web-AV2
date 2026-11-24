import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { trocarSenha } from "../api";
import Mensagem from "../componentes/Mensagem";
import RegrasSenha from "../componentes/RegrasSenha";
import { emailValido, validarSenha } from "../validacoes";

export default function PaginaTrocarSenha() {
  const [login, setLogin] = useState("");
  const [senhaAtual, setSenhaAtual] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmacao, setConfirmacao] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [tipo, setTipo] = useState("erro");
  const [enviando, setEnviando] = useState(false);
  const refLogin = useRef(null);
  const refSenhaAtual = useRef(null);
  const refSenha = useRef(null);
  const refConfirmacao = useRef(null);
  const navegar = useNavigate();

  function mostrarErro(texto, campo) {
    setTipo("erro");
    setMensagem(texto);
    campo.current?.focus();
  }

  function limpar() {
    setLogin("");
    setSenhaAtual("");
    setSenha("");
    setConfirmacao("");
    setMensagem("");
    setTipo("erro");
    refLogin.current?.focus();
  }

  async function trocar() {
    setMensagem("");
    const email = login.trim();

    if (email === "") {
      mostrarErro("Preencha o login.", refLogin);
      return;
    }
    if (!emailValido(email)) {
      mostrarErro("O login deve ser um e-mail válido.", refLogin);
      return;
    }
    if (senhaAtual === "") {
      mostrarErro("Preencha a senha atual.", refSenhaAtual);
      return;
    }
    if (senha === "") {
      mostrarErro("Preencha a senha.", refSenha);
      return;
    }
    if (confirmacao === "") {
      mostrarErro("Preencha a confirmação de senha.", refConfirmacao);
      return;
    }
    const erroSenha = validarSenha(senha);
    if (erroSenha !== "") {
      mostrarErro(erroSenha, refSenha);
      return;
    }
    if (senha !== confirmacao) {
      mostrarErro("A confirmação de senha é diferente da senha.", refConfirmacao);
      return;
    }

    setEnviando(true);
    try {
      await trocarSenha(email, senhaAtual, senha);
      setTipo("ok");
      setMensagem("Validação realizada com sucesso");
      window.alert("Validação realizada com sucesso");
      if (window.history.length > 1) {
        navegar(-1);
      } else {
        navegar("/login");
      }
    } catch (erro) {
      mostrarErro(erro.message, refSenhaAtual);
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
        <h1>Troca de senha de clientes</h1>

        <table className="formulario">
          <tbody>
            <tr>
              <td>
                <label htmlFor="login">Login (e-mail)</label>
              </td>
              <td>
                <input
                  type="text"
                  id="login"
                  ref={refLogin}
                  value={login}
                  placeholder="seuemail@exemplo.com"
                  onChange={(evento) => setLogin(evento.target.value)}
                />
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor="senhaAtual">Senha atual</label>
              </td>
              <td>
                <input
                  type="password"
                  id="senhaAtual"
                  ref={refSenhaAtual}
                  value={senhaAtual}
                  onChange={(evento) => setSenhaAtual(evento.target.value)}
                />
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor="senha">Nova senha</label>
              </td>
              <td>
                <input
                  type="password"
                  id="senha"
                  ref={refSenha}
                  value={senha}
                  onChange={(evento) => setSenha(evento.target.value)}
                />
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor="confirmacao">Confirmação da senha</label>
              </td>
              <td>
                <input
                  type="password"
                  id="confirmacao"
                  ref={refConfirmacao}
                  value={confirmacao}
                  onChange={(evento) => setConfirmacao(evento.target.value)}
                />
              </td>
            </tr>
            <tr>
              <td>Regras de composição</td>
              <td>
                <RegrasSenha />
              </td>
            </tr>
          </tbody>
        </table>

        <Mensagem texto={mensagem} tipo={tipo} />

        <div className="acoes">
          <button type="button" className="botao primario" onClick={trocar} disabled={enviando}>
            Troca Senha
          </button>
          <button type="button" className="botao" onClick={limpar}>
            Limpar
          </button>
        </div>
      </div>
    </main>
  );
}
