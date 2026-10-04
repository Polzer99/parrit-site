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
  image: "conversation" | "object";
  left: number;
  top: number;
  /** Place the marker's right edge 6px before the image coordinate. */
  anchor?: "before";
};

type ProductSceneProps = {
  title: string;
  phrase: string;
  steps: readonly [string, string, string];
  conversation: SceneImage;
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
export function ProductScene({ title, phrase, steps, conversation, object, label, markers, mention }: ProductSceneProps) {
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
        <ScenePicture image={conversation} markers={markers.filter((marker) => marker.image === "conversation")} />
      </div>
      <div className="product-scene-object">
        <p className="product-scene-label">{label}</p>
        <ScenePicture image={object} markers={markers.filter((marker) => marker.image === "object")} />
      </div>
      <p className="product-scene-mention">{mention}</p>
    </div>
  );
}
