export default function Mensagem({ texto, tipo = "erro" }) {
  const classe = tipo === "ok" ? "mensagem ok" : "mensagem";
  return <p className={classe}>{texto}</p>;
}
