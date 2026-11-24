import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { autenticar } from "../api";
import Mensagem from "../componentes/Mensagem";
import { useAuth } from "../contexto/AuthContext";
import { emailValido } from "../validacoes";

export default function PaginaLogin() {
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [tipo, setTipo] = useState("erro");
  const [enviando, setEnviando] = useState(false);
  const refLogin = useRef(null);
  const refSenha = useRef(null);
  const navegar = useNavigate();
  const { entrar } = useAuth();

  function mostrarErro(texto, campo) {
    setTipo("erro");
    setMensagem(texto);
    campo.current?.focus();
  }

  function limpar() {
    setLogin("");
    setSenha("");
    setMensagem("");
    setTipo("erro");
    refLogin.current?.focus();
  }

  async function realizarLogin() {
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
    if (senha === "") {
      mostrarErro("Preencha a senha.", refSenha);
      return;
    }

    setEnviando(true);
    try {
      const resultado = await autenticar(email, senha);
      entrar({ login: resultado.login, nome: resultado.nome });
      setTipo("ok");
      setMensagem("Validação realizada com sucesso");
      window.alert("Validação realizada com sucesso");
      navegar("/");
    } catch (erro) {
      mostrarErro(erro.message, refSenha);
    } finally {
      setEnviando(false);
    }
  }

  function voltar() {
    if (window.history.length > 1) {
      navegar(-1);
    } else {
      navegar("/");
    }
  }

  return (
    <main>
      <div className="painel">
        <Link to="/">
          <img className="logo-form" src="/img/logo-escuro.svg" alt="Logo da NovaTech Soluções em TI" />
        </Link>
        <h1>Login de clientes</h1>

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
                <label htmlFor="senha">Senha</label>
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
          </tbody>
        </table>

        <Mensagem texto={mensagem} tipo={tipo} />

        <div className="acoes">
          <button type="button" className="botao primario" onClick={realizarLogin} disabled={enviando}>
            Realizar Login
          </button>
          <button type="button" className="botao" onClick={limpar}>
            Limpar
          </button>
          <button type="button" className="botao" onClick={voltar}>
            Voltar
          </button>
        </div>

        <p className="links-form">
          <Link to="/trocar-senha">Esqueci / trocar minha senha</Link>
          <Link to="/cadastro">Cadastrar-se</Link>
        </p>
      </div>
    </main>
  );
}
