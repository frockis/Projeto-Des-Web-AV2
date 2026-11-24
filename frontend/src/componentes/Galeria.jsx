const fotos = [
  { src: "/img/foto1.svg", alt: "Recepção e escritório da empresa", legenda: "Recepção e escritório" },
  { src: "/img/foto2.svg", alt: "Datacenter próprio da empresa", legenda: "Datacenter próprio" },
  { src: "/img/foto3.svg", alt: "Equipe de suporte técnico", legenda: "Equipe de suporte" },
  { src: "/img/foto4.svg", alt: "Sala de reuniões", legenda: "Sala de reuniões" },
];

export default function Galeria() {
  return (
    <div className="galeria">
      {fotos.map((foto) => (
        <figure key={foto.src}>
          <img src={foto.src} alt={foto.alt} />
          <figcaption>{foto.legenda}</figcaption>
        </figure>
      ))}
    </div>
  );
}
