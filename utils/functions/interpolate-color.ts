export default function interpolateColor(
  col1: string,
  col2: string,
  p: number
) {
  const [r1, g1, b1] = col1.split(" ").map((x) => parseInt(x));
  const [r2, g2, b2] = col2.split(" ").map((x) => parseInt(x));

  const q = 1 - p;
  const rr = Math.round(r1 * p + r2 * q);
  const rg = Math.round(g1 * p + g2 * q);
  const rb = Math.round(b1 * p + b2 * q);

  return Number((rr << 16) + (rg << 8) + rb).toString(16);
}
