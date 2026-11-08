import connector from "@/system/brand-os.connectors.json";

/** VS-CONNECTOR: straight shaft and filled vector head, in canonical CSS pixels. */
export function BrandConnector() {
  const { stroke, head_len: headLength, head_w: headWidth, min_shaft: shaft, clearance } = connector.px;
  const width = shaft + headLength + clearance * 2;
  const height = headWidth + clearance * 2;
  const start = clearance;
  const join = start + shaft;
  const center = height / 2;
  return <svg className="brand-connector" data-connector={connector.id} width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden="true" focusable="false">
    <path d={`M${start} ${center}H${join}`} fill="none" stroke="currentColor" strokeWidth={stroke}/>
    <path d={`M${join} ${center - headWidth / 2}L${join + headLength} ${center}L${join} ${center + headWidth / 2}Z`} fill="currentColor"/>
  </svg>;
}
