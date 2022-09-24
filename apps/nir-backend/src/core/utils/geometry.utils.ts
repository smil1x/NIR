import { IPoint, IStraightLine, IVector2 } from '../interfaces';

export const vector2FromPoints = (p1: IPoint, p2: IPoint): IVector2 => {
  return { x: p2.x - p1.x, y: p2.y - p1.y };
};

export const v2ScalarProduct = (vec1: IVector2, vec2: IVector2): number => {
  return vec1.x * vec2.x + vec1.y * vec2.y;
};

export const distanceBetweenPoints = (p1: IPoint, p2: IPoint): number => {
  return Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);
};

export const pointDeviationFromStraightLine = (
  straightLine: IStraightLine,
  point: IPoint,
): number => {
  return Math.abs(
    ((straightLine.x2 - straightLine.x1) * (point.y - straightLine.y1) -
      (straightLine.y2 - straightLine.y1) * (point.x - straightLine.x1)) /
      Math.pow(
        Math.pow(straightLine.x2 - straightLine.x1, 2) +
          Math.pow(straightLine.y2 - straightLine.y1, 2),
        0.5,
      ),
  );
};

export const pointDeviationFromLineSegment = (
  lineSegment: IStraightLine,
  point: IPoint,
) => {
  let pointDeviation;

  const vectorS1P: IVector2 = vector2FromPoints(
    { x: lineSegment.x1, y: lineSegment.y1 },
    point,
  );

  const vectorS1S2: IVector2 = vector2FromPoints(
    { x: lineSegment.x1, y: lineSegment.y1 },
    { x: lineSegment.x2, y: lineSegment.y2 },
  );

  const vectorS2P: IVector2 = vector2FromPoints(
    { x: lineSegment.x2, y: lineSegment.y2 },
    point,
  );
  const vectorS2S1: IVector2 = vector2FromPoints(
    { x: lineSegment.x2, y: lineSegment.y2 },
    { x: lineSegment.x1, y: lineSegment.y1 },
  );

  if (
    v2ScalarProduct(vectorS1P, vectorS1S2) < 0 ||
    v2ScalarProduct(vectorS2P, vectorS2S1) < 0
  ) {
    const lineS1P = distanceBetweenPoints(
      { x: lineSegment.x1, y: lineSegment.y1 },
      point,
    );
    const lineS2P = distanceBetweenPoints(
      { x: lineSegment.x2, y: lineSegment.y2 },
      point,
    );
    pointDeviation = Math.min(lineS1P, lineS2P);
  } else {
    pointDeviation = pointDeviationFromStraightLine(lineSegment, point);
  }

  return pointDeviation;
};
