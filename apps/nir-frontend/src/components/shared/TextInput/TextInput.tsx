import { useCallback } from "react";
import style from './TextInput.module.css'

const TextInput = ({ value, placeholder, disabled, onChange }: any) => {
  const handleChange = useCallback((event : any) => {
    const { value } = event.target;

    onChange(value);
  }, []);

  return (
    <input
      className={style.input}
      type="text"
      value={value}
      placeholder={placeholder}
      onChange={handleChange}
      disabled={disabled}
    />
  );
};

export default TextInput;