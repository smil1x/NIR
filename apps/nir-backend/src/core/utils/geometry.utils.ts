import { IRouteSegment, IGeoVector2, Point } from '../interfaces';
import * as haversine from 'haversine';

export const vector2FromPoints = (p1: Point, p2: Point): IGeoVector2 => {
  return {
    lat: Number(p2.lat) - Number(p1.lat),
    lon: Number(p2.lon) - Number(p1.lon),
  };
};

export const v2ScalarProduct = (
  vec1: IGeoVector2,
  vec2: IGeoVector2,
): number => {
  return vec1.lon * vec2.lon + vec1.lat * vec2.lat;
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
  routeSegment: IRouteSegment,
  point: Point,
): number => {
  let pointDeviation;

  const vectorSP: IGeoVector2 = vector2FromPoints(routeSegment.start, point);

  const vectorSE: IGeoVector2 = vector2FromPoints(
    routeSegment.start,
    routeSegment.end,
  );

  const vectorEP: IGeoVector2 = vector2FromPoints(routeSegment.end, point);
  const vectorES: IGeoVector2 = vector2FromPoints(
    routeSegment.end,
    routeSegment.start,
  );

  const lineSP = metersBetweenGeoCoordinates(routeSegment.start, point);
  const lineEP = metersBetweenGeoCoordinates(routeSegment.end, point);

  if (
    v2ScalarProduct(vectorSP, vectorSE) < 0 ||
    v2ScalarProduct(vectorEP, vectorES) < 0
  ) {
    pointDeviation = Math.min(lineSP, lineEP);
  } else {
    const base = metersBetweenGeoCoordinates(
      routeSegment.start,
      routeSegment.end,
    );
    const side1 = lineSP;
    const side2 = lineEP;
    pointDeviation = triangleHeight(base, side1, side2);
  }

  return pointDeviation;
};

export const metersBetweenGeoCoordinates = (
  start: Point,
  end: Point,
): number => {
  return haversine(
    {
      longitude: Number(start.lon),
      latitude: Number(start.lat),
    },
    {
      longitude: Number(end.lon),
      latitude: Number(end.lat),
    },
    { unit: 'meter' },
  );
};
