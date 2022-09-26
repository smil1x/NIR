export const geoJsonSample = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: { type: "LineString", coordinates: [[-9, 7], [-7, 6.25], [-6, 5.5], [-4.5, 5.25], [-3, 4], [-2, 4], [-1, 3]] },
      properties: { name: "origin track" },
    },
    {
      type: "Feature",
      geometry: { type: "LineString", coordinates: [[-9, 7], [-8, 6.5], [-6.75, 6], [-6.5, 5.25], [-5.25, 5.5], [-4.5, 5.25], [-3.75, 5]] },
      properties: { name: "history track" },
    },
    {
      type: "Feature",
      geometry: { type: "MultiPoint", coordinates: [[-9, 7], [-7, 6.25], [-6, 5.5], [-4.5, 5.25], [-3, 4], [-2, 4], [-1, 3]] },
      properties: { name: "origin track points" },
    },
    {
      type: "Feature",
      geometry: { type: "MultiPoint", coordinates: [[-9, 7], [-8, 6.5], [-6.75, 6], [-6.5, 5.25], [-5.25, 5.5], [-4.5, 5.25], [-3.75, 5]] },
      properties: { name: "history track points" },
    },
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [0,0] },
      properties: { name: "Point" },
    }
  ],
};