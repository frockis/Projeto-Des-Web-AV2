import Cabecalho from "../componentes/Cabecalho";
import CartoesServicos from "../componentes/CartoesServicos";
import Galeria from "../componentes/Galeria";
import Rodape from "../componentes/Rodape";
import TabelaFundadores from "../componentes/TabelaFundadores";

export default function PaginaInicial() {
  return (
    <>
      <style>{`
        #cabecalho h1 { font-size: 1.7rem; }
        .destaque { background: #fffdf6; }
        .galeria figure { box-shadow: 0 3px 8px rgba(18, 53, 91, 0.15); }
      `}</style>

      <Cabecalho titulo="Tecnologia que mantém o seu negócio no ar." />

      <main>
        <section id="historia" className="card destaque">
          <h2>Nossa história</h2>
          <div className="rolagem">
            <p>
              A <strong>NovaTech</strong> nasceu em 2012, em Recife, quando três amigos de faculdade perceberam que pequenas e médias empresas da região sofriam com sistemas lentos, redes instáveis e nenhum plano em caso de falha. Começamos atendendo clientes em uma sala alugada, com dois computadores e muita vontade de resolver problemas.
            </p>
            <p>
              Em 2015 inauguramos nosso <em>datacenter próprio</em>, o que nos permitiu oferecer hospedagem, backup e monitoramento 24 horas com preços acessíveis. Nesse período, a carteira de clientes saltou de 12 para mais de 150 empresas.
            </p>
            <p>
              Hoje somos uma equipe de 45 profissionais certificados em infraestrutura, desenvolvimento, segurança e suporte. Nosso compromisso continua o mesmo do primeiro dia: <mark>entender o problema do cliente antes de vender qualquer solução</mark>.
            </p>
            <p>
              Atendemos comércio, clínicas, escolas e indústrias, sempre com contrato claro, prazos definidos e acompanhamento de cada solicitação até a entrega.
            </p>
          </div>
        </section>

        <section id="video">
          <h2>Conheça a NovaTech em 1 minuto</h2>
          <div className="video-wrapper">
            <iframe
              src="https://www.youtube.com/embed/M7lc1UVf-VE"
              title="Vídeo institucional da NovaTech"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </section>

        <section id="galeria">
          <h2>Nossas instalações e equipe</h2>
          <Galeria />
        </section>

        <section id="servicos">
          <h2>Serviços de TI</h2>
          <CartoesServicos />
        </section>

        <section id="fundadores">
          <h2>Quem fundou a NovaTech</h2>
          <TabelaFundadores />
        </section>
      </main>

      <Rodape />
    </>
  );
}
