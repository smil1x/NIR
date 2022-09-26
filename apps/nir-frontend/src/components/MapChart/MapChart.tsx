import React, { useState } from 'react'
import { Map, GeoJson  } from 'pigeon-maps'
import './MapChart.css'
import { styleHistoryPoint, styleHistoryTrack, styleRoutePoint, styleRouteTrack } from "../../utils";
import MapModal from "./MapModal/MapModal";

const MapChart = ({geoJson}: any) => {
  const [center, setCenter] = useState<[number, number]>([0, 0])
  const [zoom, setZoom] = useState(2)

  const onHover = (props:any) => {
    console.log(props);
  }

  return (
    <div className='map-container'>
      <MapModal/>
      <Map
        center={center}
        zoom={zoom}
        minZoom={2}
        onBoundsChanged={({ center, zoom }) => {
          setCenter(center)
          setZoom(zoom)
        }}
      >
        <GeoJson
          data={geoJson}
          styleCallback={(feature: any, hover: any) => {
            const style = {}
            styleRouteTrack(feature, hover, style)
            styleHistoryTrack(feature, hover, style)
            styleRoutePoint(feature, hover, style)
            styleHistoryPoint(feature, hover, style, onHover)
            return style;
          }}
        />
      </Map>
    </div>

  )
}

export default MapChart;