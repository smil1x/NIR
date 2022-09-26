import styles from './TextArea.module.css'
import { useCallback } from "react";

const TextArea = ({ value, placeholder, disabled, onChange }: any) => {
  const handleChange = useCallback((event : any) => {
    const { value } = event.target;

    onChange(value);
  }, []);


  return <textarea className={styles.textArea}
                   cols={100}
                   value={value}
                   placeholder={placeholder}
                   onChange={handleChange}
                   disabled={disabled}/>
}

export default TextArea;