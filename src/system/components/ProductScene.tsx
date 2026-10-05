import "./ProductScene.css";

type SceneImage = {
  /** Local basename, without extension. */
  src: string;
  width: number;
  height: number;
  widths: readonly [number, number];
  sizes: string;
  alt: string;
};

type SceneMarker = {
  number: 1 | 2 | 3;
  image: "object";
  left: number;
  top: number;
  /** Place the marker's right edge 6px before the image coordinate. */
  anchor?: "before";
};

type ProductSceneProps = {
  title: string;
  phrase: string;
  steps: readonly [string, string, string];
  object: SceneImage;
  label: string;
  markers: readonly SceneMarker[];
  mention: string;
};

function ScenePicture({ image, markers }: { image: SceneImage; markers: readonly SceneMarker[] }) {
  const srcSet = (format: string) => image.widths.map((width) => `${image.src}-${width}.${format} ${width}w`).join(", ");
  return (
    <div className="product-scene-image">
      <picture>
        <source type="image/avif" srcSet={srcSet("avif")} sizes={image.sizes} />
        <source type="image/webp" srcSet={srcSet("webp")} sizes={image.sizes} />
        {/* Native picture serves the pre-sized, approved assets directly. */}
        <img src={`${image.src}.png`} alt={image.alt} width={image.width} height={image.height} loading="lazy" decoding="async" />
      </picture>
      {markers.map((marker) => (
        <span key={marker.number} className="scene-marker" aria-hidden="true" style={{ left: `${marker.left}%`, top: `${marker.top}%`, transform: marker.anchor === "before" ? "translate(calc(-100% - 6px), -50%)" : undefined }}>{marker.number}</span>
      ))}
    </div>
  );
}

/** VS-PRODUCT-SCENE: a conversation and its resulting object, without client JS. */
export function ProductScene({ title, phrase, steps, object, label, markers, mention }: ProductSceneProps) {
  return (
    <div className="product-scene">
      <div className="product-scene-copy">
        <h2>{title}</h2>
        <p>{phrase}</p>
        <ol className="product-scene-steps" role="list">
          {steps.map((step, index) => <li key={step}><span className="scene-marker" aria-hidden="true">{index + 1}</span><span>{step}</span></li>)}
        </ol>
      </div>
      <div className="product-scene-conversation">
        <Conversation />
      </div>
      <div className="product-scene-object">
        <p className="product-scene-label">{label}</p>
        <ScenePicture image={object} markers={markers.filter((marker) => marker.image === "object")} />
      </div>
      <p className="product-scene-mention">{mention}</p>
    </div>
  );
}

/** Static p2 transcript, deliberately French like the source capture, in both locales. */
function Conversation() {
  return <div className="scene-chat" data-phone-mockup lang="fr" aria-label="Exemple fictif de conversation avec l’agent CRM">
    <div className="scene-chat-header"><div><strong>Agent CRM</strong><span>bot</span></div><span className="scene-chat-avatar">CRM</span></div>
    <div className="scene-chat-messages">
      <p className="scene-chat-date">Aujourd&apos;hui</p>
      <div className="scene-chat-bubble scene-chat-outgoing">
        <span className="scene-marker" aria-hidden="true">1</span>
        {/* Unretouched crop of the approved p2 PNG; served directly to preserve pixels. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/scenes/scene-carte-visite-photo.png" width={754} height={520} loading="lazy" decoding="async" alt="Carte de visite fictive : Contact achat, acheteur chez Prospect B" />
        <p>nouveau contact chez Prospect B, vu ce matin</p><ChatTime value="08:04" sent />
      </div>
      <div className="scene-chat-bubble"><p>Je crée <strong>Contact achat</strong> (acheteur) chez <strong>Prospect B</strong>. C&apos;est bon ?</p><ChatTime value="08:04" /></div>
      <div className="scene-chat-choices" aria-label="Réponses illustrées, démonstration non interactive">
        <span><CheckIcon /> Oui</span><span><svg viewBox="0 0 20 20" aria-hidden="true"><path d="m5 5 10 10M15 5 5 15" /></svg> Non</span>
      </div>
      <div className="scene-chat-bubble scene-chat-outgoing scene-chat-approval"><span className="scene-marker" aria-hidden="true">2</span><p>oui</p><ChatTime value="08:05" sent /></div>
      <div className="scene-chat-bubble"><p><CheckIcon /> C&apos;est créé : <strong>Contact achat</strong> (acheteur) chez <strong>Prospect B</strong>.</p><ChatTime value="08:05" /></div>
    </div>
    <div className="scene-chat-input">Message</div>
  </div>;
}

function CheckIcon() {
  return <svg className="scene-chat-check" viewBox="0 0 20 20" aria-hidden="true"><rect width="20" height="20" /><path d="m4 10 4 4 8-9" /></svg>;
}

function ChatTime({ value, sent = false }: { value: string; sent?: boolean }) {
  return <span className="scene-chat-time">{value}{sent && <svg viewBox="0 0 32 20" aria-label="Lu"><path d="m2 10 5 5L18 3M14 12l3 3L28 3" /></svg>}</span>;
}
