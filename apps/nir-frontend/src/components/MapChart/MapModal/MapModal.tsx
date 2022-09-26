import styles from './Modal.module.css';

const MapModal = (jsonData: any) => {
  const testData = {
    lon: '-52.6571',
    lat: '64.2444',
    deviation: '506'
  }
  const  a = JSON.stringify(testData, null, 3)
  return <div className={styles.mapModal}>
    <div><pre>{JSON.stringify(testData, null, 2) }</pre></div>
  </div>
}

export default MapModal