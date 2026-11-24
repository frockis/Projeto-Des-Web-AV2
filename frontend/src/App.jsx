import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./contexto/AuthContext";
import PaginaInicial from "./paginas/PaginaInicial";
import PaginaLogin from "./paginas/PaginaLogin";
import PaginaTrocarSenha from "./paginas/PaginaTrocarSenha";
import PaginaCadastro from "./paginas/PaginaCadastro";
import PaginaCarrinho from "./paginas/PaginaCarrinho";
import PaginaCadastroServico from "./paginas/PaginaCadastroServico";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PaginaInicial />} />
          <Route path="/login" element={<PaginaLogin />} />
          <Route path="/trocar-senha" element={<PaginaTrocarSenha />} />
          <Route path="/cadastro" element={<PaginaCadastro />} />
          <Route path="/carrinho" element={<PaginaCarrinho />} />
          <Route path="/cadastro-servico" element={<PaginaCadastroServico />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
