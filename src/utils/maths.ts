type Point = { x: number; y: number };

/* ===========================
   SVG MATH HELPERS
=========================== */

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number): Point {
  const angleRad = (angleDeg - 90) * (Math.PI / 180);
  return {
    x: cx + r * Math.cos(angleRad),
    y: cy + r * Math.sin(angleRad),
  };
}

function describeArc(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number,
): string {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

  return ['M', start.x, start.y, 'A', r, r, 0, largeArcFlag, 0, end.x, end.y].join(' ');
}

export { Point, polarToCartesian, describeArc };
