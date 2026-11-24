const servicos = [
  {
    titulo: "Suporte técnico",
    itens: ["Atendimento remoto e presencial", "Manutenção de computadores", "Gestão de licenças"],
  },
  {
    titulo: "Infraestrutura e redes",
    itens: ["Cabeamento estruturado", "Wi-Fi corporativo", "Servidores e virtualização"],
  },
  {
    titulo: "Nuvem e backup",
    itens: ["Hospedagem em datacenter próprio", "Backup automático diário", "Recuperação de desastres"],
  },
  {
    titulo: "Segurança da informação",
    itens: ["Firewall e antivírus gerenciados", "Adequação à LGPD", "Treinamento de equipes"],
  },
  {
    titulo: "Desenvolvimento de sistemas",
    itens: ["Sites e lojas virtuais", "Sistemas sob medida", "Integrações e automações"],
  },
];

export default function CartoesServicos() {
  return (
    <div className="servicos">
      {servicos.map((servico) => (
        <article className="card" key={servico.titulo}>
          <h3>{servico.titulo}</h3>
          <ul>
            {servico.itens.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  );
}
