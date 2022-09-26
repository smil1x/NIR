import MapChart from "./components/MapChart/MapChart";
import './App.css'
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Panel from "./components/Panel/Panel";
import { useState } from "react";

const App = () => {
  const [geoJson, setGeoJson] = useState({
    type: "FeatureCollection",
    features: [],
  })

  return <>
    <Header/>
    <div className='App'>
      <MapChart geoJson={geoJson}/>
      <Panel onGeoJsonChange={setGeoJson}/>
    </div>
    <Footer/>
  </>

}

export default App;