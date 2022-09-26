import React from 'react';
import './Button.css';

const Button = ({ children, onClick, disabled, color }: any) => {
  const buttonClass = 'button' + ' ' + color
  return (
    <button className={buttonClass} disabled={disabled} onClick={onClick} type="button">
      {children}
    </button>
  );
};

export default Button;