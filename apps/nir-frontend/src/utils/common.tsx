export const isJson = (str:any) => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

export const generateLineStringGeoFeature = (points: any, name: string) => {
  const coordinates = points.map(({lat, lon}: any) => {
    return [ Number(lon), Number(lat)]
  })
  return {
    type: "Feature",
    geometry: {
      type: "LineString",
      coordinates: coordinates
    },
    properties: {name: name}
  }
}

export const generatePointGeoFeature = (point: any, type: string, pointId: number) => {
  const {lat, lon} = point
  return {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [ Number(lon), Number(lat)]
    },
    properties: {
      ...point,
      type: type,
      pointId: pointId
    }
  }
}

export const generatePointsGeoFeatures = (points: any, type: any) => {
  return points.map((point: any, index: number) => {
    return generatePointGeoFeature(point, type, index)
  })
}

export const routeDeviationGeoJson = (route: any, history: any) => {
  return {
    type: "FeatureCollection",
    features: [
      generateLineStringGeoFeature(route, 'route'),
      generateLineStringGeoFeature(history, 'history'),
      ...generatePointsGeoFeatures(route, 'routePoint'),
      ...generatePointsGeoFeatures(history, 'historyPoint'),
    ]
  }
}

export const styleRouteTrack = (feature: any, hover: any, styles: any) => {
  if (feature.geometry.type === "LineString" && feature.properties.name === 'route') {
    styles.strokeWidth = '6';
    styles.stroke = '#00A569'
  }
}

export const styleHistoryTrack = (feature: any, hover: any, styles: any) => {
  if (feature.geometry.type === "LineString" && feature.properties.name === 'history') {
    styles.strokeWidth = '4'
    styles.stroke = 'yellow'
  }
}

export const styleRoutePoint = (feature: any, hover: any, styles: any, onHover: any) => {
  if (feature.geometry.type === 'Point' && feature.properties.type === 'routePoint') {
    styles.fill = '#3D826B';
    styles.r = '5'
    hover && onHover(feature.properties, 'routePoint')
  }
}

export const styleHistoryPoint = (feature: any, hover: any, styles: any, onHover: any) => {
  if (feature.geometry.type === 'Point' && feature.properties.type === 'historyPoint') {
    styles.fill = '#E2AD05';
    styles.r = '4'
    if(feature.properties.isDeviated == true){
      styles.fill = 'red'
    }
    hover && onHover(feature.properties)
  }
}

const isEqualPoint = (point1:any, point2: any) => {
  return point1.lat === point2.lat && point1.lon === point2.lon
}