import React, { useState } from 'react'
import { Map, GeoJson  } from 'pigeon-maps'
import './MapChart.css'
import { styleHistoryPoint, styleHistoryTrack, styleRoutePoint, styleRouteTrack } from "../../utils";
import MapModal from "./MapModal/MapModal";

const MapChart = ({geoJson}: any) => {
  const [center, setCenter] = useState<[number, number]>([0, 0])
  const [zoom, setZoom] = useState(2)
  const [modalInfo, setModalInfo] = useState({})

  const onPointHover = (pointProps:any, type: any) => {
    setModalInfo(pointProps)
    console.log(pointProps);
  }

  return (
    <div className='map-container'>
      <MapModal info={modalInfo}/>
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
            styleRoutePoint(feature, hover, style, onPointHover)
            styleHistoryPoint(feature, hover, style, onPointHover)
            return style;
          }}
        />
      </Map>
    </div>

  )
}

export default MapChart;