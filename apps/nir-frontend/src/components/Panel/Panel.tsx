import './Panel.css'
import HistorySection from "./components/HistorySection";
import DeviationSection from "./components/DeviationSection";
import { useState } from "react";
import {
  generateLineStringGeoFeature,
  generatePointsGeoFeatures, isJson, requestDeviationFromRoute,
  requestHistoryRout,
  routeDeviationGeoJson
} from "../../utils";
import { historyDataSample } from "../../mock-data/historyData";

const Panel = ({onGeoJsonChange} : any) => {
  const [historyData, setHistoryData] = useState('')
  const [routeData, setRouteData] = useState('')


  const handleHistoryRoutDisplay = () => {
    const geoJson = {
      type: "FeatureCollection",
      features: [
        generateLineStringGeoFeature(JSON.parse(historyData), 'history'),
        ...generatePointsGeoFeatures(JSON.parse(historyData), 'historyPoint'),
      ]
    }
    onGeoJsonChange(geoJson)
  }

  const getHistoryRout = async (shipId:any, days: any) => {
    requestHistoryRout(shipId, days).then(data => {
      setHistoryData(JSON.stringify(data, null, 2))
    })
  }

  const handleTest = () => {
    setHistoryData(JSON.stringify(historyDataSample, null, 2))
  }

  const addRandomDeviation = (maxDegreeDeviation: any) => {
    const jsonRout = JSON.parse(routeData);
    const deviationRout = jsonRout.map((point: any) => {
      const plusOrMinusLon = Math.random() < 0.5 ? -1 : 1
      const plusOrMinusLat = Math.random() < 0.5 ? -1 : 1
      const randomDeviationLon = Math.random() * Number(maxDegreeDeviation) * plusOrMinusLon;
      const randomDeviationLat = Math.random() * Number(maxDegreeDeviation) * plusOrMinusLat

      return {
        ...point,
        lat: (Number(point.lat) + randomDeviationLat).toFixed(5).toString(),
        lon: (Number(point.lon) + randomDeviationLon).toFixed(5).toString(),
      }
    })

    setRouteData(JSON.stringify(deviationRout, null, 2))

    const isHistoryDataJson = isJson(historyData)
    const geoJson = routeDeviationGeoJson(deviationRout, isHistoryDataJson ? JSON.parse(historyData) : [])
    onGeoJsonChange(geoJson)
  }

  const removeRandomPoints = (amount: any)=> {
    const jsonRout = JSON.parse(routeData)
    const asd = Math.min(jsonRout.length-2, Number(amount))
    for (let i = 0; i < asd ; i++) {
      const randomIndex = Math.floor(Math.random() * jsonRout.length);
      jsonRout.splice(randomIndex,1)
    }
    setRouteData(JSON.stringify(jsonRout, null, 2));
    const geoJson = routeDeviationGeoJson(jsonRout, JSON.parse(historyData))
    onGeoJsonChange(geoJson)
  }

  const calculateDeviation = (shipId:any,
                              routeData: any,
                              normalDeviation: any,
                              days: any) => {
    requestDeviationFromRoute(shipId, JSON.parse(routeData), normalDeviation, days)
      .then((deviationModel) => {
        const geoJson = routeDeviationGeoJson(deviationModel.route, deviationModel.historyTrack);
        onGeoJsonChange(geoJson);
      });

  }

  const useHistory = () => {
    setRouteData(historyData)
    const geoJson = routeDeviationGeoJson(JSON.parse(historyData), JSON.parse(historyData))
    onGeoJsonChange(geoJson)
  }


  return <div className='panel-container'>
    <HistorySection historyData={historyData}
                    handleHistoryRoutDisplay={handleHistoryRoutDisplay}
                    handleSubmit={getHistoryRout}
                    handleTest={handleTest}
    />
    <DeviationSection routeData={routeData}
                      setRouteData={setRouteData}
                      addRandomDeviation={addRandomDeviation}
                      removeRandomPoints={removeRandomPoints}
                      calculateDeviation={calculateDeviation}
                      useHistory={useHistory}
    />
  </div>
};

export default Panel;