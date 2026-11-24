import { Link } from "react-router-dom";
import { useAuth } from "../contexto/AuthContext";

export default function Cabecalho({ titulo }) {
  const { usuario, sair } = useAuth();

  return (
    <header id="cabecalho">
      <div className="cabecalho-interno">
        <img src="/img/logo.svg" alt="Logo da NovaTech Soluções em TI" />
        <h1>{titulo}</h1>
        <nav>
          <ul>
            {!usuario && (
              <li>
                <Link to="/login">Login</Link>
              </li>
            )}
            {!usuario && (
              <li>
                <Link to="/cadastro">Cadastrar-se</Link>
              </li>
            )}
            {usuario && (
              <li>
                <Link to="/cadastro">Cadastro Cliente</Link>
              </li>
            )}
            {usuario && (
              <li>
                <Link to="/carrinho">Serviços</Link>
              </li>
            )}
            <li>
              <Link to="/cadastro-servico">Cadastrar serviço</Link>
            </li>
            {usuario && (
              <li>
                <Link to="/" onClick={sair}>
                  Sair
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}
