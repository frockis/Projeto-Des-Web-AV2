import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { cadastrarCliente } from "../api";
import Mensagem from "../componentes/Mensagem";
import RegrasSenha from "../componentes/RegrasSenha";
import {
  apenasDigitos,
  cpfValido,
  emailValido,
  maiorDeIdade,
  mascaraCPF,
  mascaraTelefone,
  telefoneValido,
  validarNome,
  validarSenha,
} from "../validacoes";

const estadosCivis = ["Solteiro(a)", "Casado(a)", "Divorciado(a)", "Viúvo(a)"];
const escolaridades = [
  "1º grau incompleto",
  "1º grau completo",
  "2º grau completo",
  "Nível superior",
  "Pós-graduado",
];

export default function PaginaCadastro() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmacao, setConfirmacao] = useState("");
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [nascimento, setNascimento] = useState("");
  const [telefone, setTelefone] = useState("");
  const [estadoCivil, setEstadoCivil] = useState("Solteiro(a)");
  const [escolaridade, setEscolaridade] = useState("2º grau completo");
  const [mensagem, setMensagem] = useState("");
  const [tipo, setTipo] = useState("erro");
  const [enviando, setEnviando] = useState(false);

  const refEmail = useRef(null);
  const refSenha = useRef(null);
  const refConfirmacao = useRef(null);
  const refNome = useRef(null);
  const refCpf = useRef(null);
  const refNascimento = useRef(null);
  const refTelefone = useRef(null);
  const navegar = useNavigate();

  function mostrarErro(texto, campo) {
    setTipo("erro");
    setMensagem(texto);
    campo.current?.focus();
  }

  function limpar() {
    setEmail("");
    setSenha("");
    setConfirmacao("");
    setNome("");
    setCpf("");
    setNascimento("");
    setTelefone("");
    setEstadoCivil("Solteiro(a)");
    setEscolaridade("2º grau completo");
    setMensagem("");
    setTipo("erro");
    refEmail.current?.focus();
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
    const login = email.trim();

    if (login === "") {
      mostrarErro("Preencha o e-mail.", refEmail);
      return;
    }
    if (!emailValido(login)) {
      mostrarErro("O e-mail informado não é válido.", refEmail);
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

    const erroNome = validarNome(nome);
    if (erroNome !== "") {
      mostrarErro(erroNome, refNome);
      return;
    }

    if (cpf === "") {
      mostrarErro("Preencha o CPF.", refCpf);
      return;
    }
    if (!/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(cpf)) {
      mostrarErro("O CPF deve estar no formato NNN.NNN.NNN-NN.", refCpf);
      return;
    }
    if (!cpfValido(cpf)) {
      mostrarErro("O CPF informado é inválido.", refCpf);
      return;
    }

    if (nascimento === "") {
      mostrarErro("Preencha a data de nascimento.", refNascimento);
      return;
    }
    if (!maiorDeIdade(nascimento)) {
      mostrarErro("O cliente deve ter 18 anos ou mais.", refNascimento);
      return;
    }

    if (telefone !== "" && !telefoneValido(telefone)) {
      mostrarErro("Telefone inválido. Use o formato (DD) 99999-9999.", refTelefone);
      return;
    }

    setEnviando(true);
    try {
      await cadastrarCliente({
        login,
        senha,
        nome: nome.trim(),
        cpf,
        dataNascimento: nascimento,
        telefone,
        estadoCivil,
        escolaridade,
      });
      setTipo("ok");
      setMensagem("Validação realizada com sucesso");
      window.alert("Validação realizada com sucesso");
    } catch (erro) {
      mostrarErro(erro.message, refEmail);
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
        <h1>Cadastro de clientes</h1>

        <table className="formulario">
          <tbody>
            <tr>
              <td>
                <label htmlFor="email">E-mail (login)</label>
              </td>
              <td>
                <input
                  type="text"
                  id="email"
                  ref={refEmail}
                  value={email}
                  placeholder="seuemail@exemplo.com"
                  onChange={(evento) => setEmail(evento.target.value)}
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
            <tr>
              <td>
                <label htmlFor="nome">Nome completo</label>
              </td>
              <td>
                <input
                  type="text"
                  id="nome"
                  ref={refNome}
                  value={nome}
                  onChange={(evento) => setNome(evento.target.value)}
                />
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor="cpf">CPF</label>
              </td>
              <td>
                <input
                  type="text"
                  id="cpf"
                  ref={refCpf}
                  value={cpf}
                  placeholder="000.000.000-00"
                  maxLength={14}
                  inputMode="numeric"
                  onKeyDown={apenasDigitos}
                  onChange={(evento) => setCpf(mascaraCPF(evento.target.value))}
                />
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor="nascimento">Data de nascimento</label>
              </td>
              <td>
                <input
                  type="date"
                  id="nascimento"
                  ref={refNascimento}
                  value={nascimento}
                  onChange={(evento) => setNascimento(evento.target.value)}
                />
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor="telefone">Celular / WhatsApp (opcional)</label>
              </td>
              <td>
                <input
                  type="text"
                  id="telefone"
                  ref={refTelefone}
                  value={telefone}
                  placeholder="(81) 99999-9999"
                  maxLength={15}
                  inputMode="numeric"
                  onKeyDown={apenasDigitos}
                  onChange={(evento) => setTelefone(mascaraTelefone(evento.target.value))}
                />
              </td>
            </tr>
            <tr>
              <td>Estado civil</td>
              <td>
                {estadosCivis.map((opcao, indice) => (
                  <label key={opcao}>
                    <input
                      type="radio"
                      name="estadoCivil"
                      value={opcao}
                      checked={estadoCivil === opcao}
                      onChange={() => setEstadoCivil(opcao)}
                    />
                    <span>{opcao}</span>
                    {indice === 2 ? <br /> : null}
                  </label>
                ))}
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor="escolaridade">Escolaridade</label>
              </td>
              <td>
                <select
                  id="escolaridade"
                  value={escolaridade}
                  onChange={(evento) => setEscolaridade(evento.target.value)}
                >
                  {escolaridades.map((opcao) => (
                    <option key={opcao} value={opcao}>
                      {opcao}
                    </option>
                  ))}
                </select>
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
      </div>
    </main>
  );
}
