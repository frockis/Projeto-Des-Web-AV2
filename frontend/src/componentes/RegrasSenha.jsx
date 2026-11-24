export default function RegrasSenha() {
  return (
    <output className="instrucoes" style={{ display: "block" }}>
      <strong>Regras da senha</strong>
      <ul>
        <li>Mínimo de 6 caracteres.</li>
        <li>Pelo menos 1 número, 1 letra maiúscula e 1 caractere especial permitido.</li>
        <li>
          Especiais permitidos: <strong>{"@ # $ % & * ! ? / \\ | - _ + . ="}</strong>
        </li>
        <li>
          Não permitidos: <strong>{"¨ { } [ ] ´ ` ~ ^ : ; < > , \" ' “ ” ‘ ’"}</strong>
        </li>
      </ul>
    </output>
  );
}
