import styles from "./Modal.module.css";

const MapModal = ({ info }: any) => {
  return <div className={styles.mapModal}>
    <div className={styles.title}>Point info</div>
    {info.lat && <div>lat: {info.lat}</div>}
    {info.lon && <div>lon: {info.lon}</div>}
    {info.deviation && <div>deviation: {Number(info.deviation).toFixed(0)} meters</div>}
  </div>;
};

export default MapModal;