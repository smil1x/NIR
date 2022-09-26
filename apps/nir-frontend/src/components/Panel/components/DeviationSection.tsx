import TextInput from "../../shared/TextInput/TextInput";
import Button from "../../shared/ Button/Button";
import TextArea from "../../shared/TextArea/TextArea";
import styles from './DeviationSection.module.css'
import { useState } from "react";
import { isJson } from "../../../utils";

const routePlaceholder = 'Rout: [' +
  '{\n' +
  '    "mmsi": "636014709",\n' +
  '    "imo": "9351098",\n' +
  '    "status": "0",\n' +
  '    "speed": "104",\n' +
  '    "lon": "-52.6571",\n' +
  '    "lat": "64.2444",\n' +
  '    "course": "92",\n' +
  '    "heading": "94",\n' +
  '    "timestamp": "2022-09-22 12:17:00",\n' +
  '    "shipId": "312216"\n' +
  '  }' +
  ']';

const DeviationSection = (
  {
    routeData,
    setRouteData,
    addRandomDeviation,
    removeRandomPoints,
    calculateDeviation,
    useHistory
  } :any) => {
  const [shipId, setShipId] = useState('');
  const [days, setDays] = useState('');
  const [normalDeviation, setNormalDeviation] = useState('');
  const [maxDegreeDeviation, setMaxDegreeDeviation] = useState('')
  const [pointsAmount, setPointsAmount] = useState('')

  const onRandomDeviation = () => {
    addRandomDeviation(maxDegreeDeviation)
  }

  const onRandomRemove = () => {
    removeRandomPoints(pointsAmount)
  }

  const onCalculateDeviation = () => {
    calculateDeviation(shipId, routeData, normalDeviation, days)
  }

  return <section className={styles.deviationSection}>
    <h2>Find route deviation</h2>
    <Button color='primary' onClick={useHistory}>
      Use history as rout
    </Button>

    <span>Points: {isJson(routeData) && JSON.parse(routeData).length}</span>
    <div className={styles.routeSection}>
      <TextArea value={routeData} onChange={setRouteData} placeholder={routePlaceholder}/>
      <div className={styles.randomSection}>
        <TextInput value={maxDegreeDeviation} placeholder = 'max degree deviation' onChange={setMaxDegreeDeviation}/>
        <Button color='secondary' disabled={!maxDegreeDeviation || !routeData} onClick={onRandomDeviation}>
          Add random deviation
        </Button>
        <TextInput value={pointsAmount} placeholder = 'amount of points' onChange={setPointsAmount}/>
        <Button color='secondary' disabled={!pointsAmount || !routeData} onClick={onRandomRemove}>
          Random remove
        </Button>
      </div>
    </div>

    <div className={styles.historyInputs}>
      <TextInput value={shipId} placeholder = 'shipId' onChange={setShipId}/>
      <TextInput value={days} placeholder = 'period in days' onChange={setDays}/>
      <TextInput value={normalDeviation}
                 placeholder = 'normal deviation in m'
                 onChange={setNormalDeviation}/>
      <Button color='primary'
              onClick={onCalculateDeviation}
              disabled={!shipId || !days || !normalDeviation || !routeData}>
        Calculate
      </Button>
    </div>
  </section>
}

export default DeviationSection;