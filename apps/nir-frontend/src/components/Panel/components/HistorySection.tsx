import TextInput from "../../shared/TextInput/TextInput";
import Button from "../../shared/ Button/Button";
import styles from './HistorySection.module.css'
import { useEffect, useState } from "react";
import TextArea from "../../shared/TextArea/TextArea";
import { isJson } from "../../../utils";

const HistorySection = ({handleSubmit,
                          handleHistoryRoutDisplay,
                          historyData,
                          handleTest,
                          shipId,
                          days,
                          onDaysChange,
                          onShipIdChange
}: any) => {
  const [historyRout, setHistoryRout] = useState(historyData)

  useEffect(() => {
    setHistoryRout(historyData)
  }, [historyData])

  const onSubmit = () => {
    handleSubmit(shipId, days)
  }

  const onTest = () => {
    handleTest()
  }

  const onDisplay = () => {
    handleHistoryRoutDisplay()
  }

  return <section className={styles.historySection}>
    <h2>Get ship route history</h2>
    <div className={styles.historyInputs}>
      <TextInput value={shipId} placeholder = 'shipId' onChange={onShipIdChange}/>
      <TextInput value={days} placeholder = 'period in days' onChange={onDaysChange}/>
      <Button color='primary' disabled={!days || !shipId} onClick={onSubmit}>
        Get history
      </Button>
      <Button color='secondary' onClick={onTest}>
        Test Data
      </Button>
    </div>

    <span>Points: {isJson(historyData) && JSON.parse(historyData).length}</span>
    <div className={styles.historyRoutSection}>
      <TextArea value={historyRout}
                placeholder='Data received from marineTraffic.com will be displayed here'
                disabled
      />
      <Button color='secondary' disabled={!historyRout} onClick={onDisplay}>
        Display
      </Button>
    </div>

  </section>
}

export default HistorySection