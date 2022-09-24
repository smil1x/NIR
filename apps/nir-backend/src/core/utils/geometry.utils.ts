import { IPoint, IRoutSegment, IVector2 } from '../interfaces';
import * as haversine from 'haversine';

export const vector2FromPoints = (p1: IPoint, p2: IPoint): IVector2 => {
  return { x: p2.x - p1.x, y: p2.y - p1.y };
};

export const v2ScalarProduct = (vec1: IVector2, vec2: IVector2): number => {
  return vec1.x * vec2.x + vec1.y * vec2.y;
};

export const triangleArea = (a: number, b: number, c: number) => {
  if (a > b + c || b > a + c || c > a + b) return 0;
  const p = (a + b + c) / 2;
  return (p * (p - a) * (p - b) * (p - c)) ** 0.5;
};

export const triangleHeight = (
  base: number,
  side1: number,
  side2: number,
): number => {
  const area: number = triangleArea(base, side1, side2);
  return (2 * area) / base;
};

export const pointDeviationFromRoutSegment = (
  routSegment: IRoutSegment,
  point: IPoint,
): number => {
  let pointDeviation;

  const vectorS1P: IVector2 = vector2FromPoints(
    { x: routSegment.x1, y: routSegment.y1 },
    point,
  );

  const vectorS1S2: IVector2 = vector2FromPoints(
    { x: routSegment.x1, y: routSegment.y1 },
    { x: routSegment.x2, y: routSegment.y2 },
  );

  const vectorS2P: IVector2 = vector2FromPoints(
    { x: routSegment.x2, y: routSegment.y2 },
    point,
  );
  const vectorS2S1: IVector2 = vector2FromPoints(
    { x: routSegment.x2, y: routSegment.y2 },
    { x: routSegment.x1, y: routSegment.y1 },
  );

  const lineS1P = distanceBetweenGeoCoordinates(
    { x: routSegment.x1, y: routSegment.y1 },
    point,
  );
  const lineS2P = distanceBetweenGeoCoordinates(
    { x: routSegment.x2, y: routSegment.y2 },
    point,
  );

  if (
    v2ScalarProduct(vectorS1P, vectorS1S2) < 0 ||
    v2ScalarProduct(vectorS2P, vectorS2S1) < 0
  ) {
    pointDeviation = Math.min(lineS1P, lineS2P);
  } else {
    const base = distanceBetweenGeoCoordinates(
      { x: routSegment.x1, y: routSegment.y1 },
      { x: routSegment.x2, y: routSegment.y2 },
    );
    const side1 = lineS1P;
    const side2 = lineS2P;
    pointDeviation = triangleHeight(base, side1, side2);
  }

  return pointDeviation;
};

export const distanceBetweenGeoCoordinates = (
  start: IPoint,
  end: IPoint,
): number => {
  return haversine(
    {
      longitude: start.x,
      latitude: start.y,
    },
    {
      longitude: end.x,
      latitude: end.y,
    },
  );
};
