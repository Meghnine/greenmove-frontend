import polyline from "@mapbox/polyline";


export function geometryToLatLngs(geometry) {
  if (!geometry) return [];

  
  if (typeof geometry === "string") {
    
    return polyline.decode(geometry);
  }

  
  if (geometry.type === "LineString" && Array.isArray(geometry.coordinates)) {
    return geometry.coordinates.map(([lon, lat]) => [lat, lon]);
  }

  
  if (Array.isArray(geometry.coordinates)) {
    return geometry.coordinates.map(([lon, lat]) => [lat, lon]);
  }

  return [];
}
