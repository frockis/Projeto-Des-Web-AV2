export default function ResumoServico({ preco, prazo, previsao }) {
  return (
    <div className="resumo">
      <div>
        Preço
        <span className="rotulo-valor">{preco}</span>
      </div>
      <div>
        Prazo de atendimento
        <span className="rotulo-valor">{prazo}</span>
      </div>
      <div>
        Data prevista
        <span className="rotulo-valor">{previsao}</span>
      </div>
      <div>
        Status
        <span className="rotulo-valor status-em-elaboracao">EM ELABORAÇÃO</span>
      </div>
    </div>
  );
}
