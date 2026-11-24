import { createContext, useCallback, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);
const CHAVE = "novatech_usuario";

function lerUsuarioSalvo() {
  const salvo = sessionStorage.getItem(CHAVE);
  if (!salvo) {
    return null;
  }
  try {
    return JSON.parse(salvo);
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(lerUsuarioSalvo);

  const entrar = useCallback((dados) => {
    setUsuario(dados);
    sessionStorage.setItem(CHAVE, JSON.stringify(dados));
  }, []);

  const sair = useCallback(() => {
    setUsuario(null);
    sessionStorage.removeItem(CHAVE);
  }, []);

  const valor = useMemo(() => ({ usuario, entrar, sair }), [usuario, entrar, sair]);

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
