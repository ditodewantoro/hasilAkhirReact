import React from "react";

const Button = ({ style, text, onClick }) => {
  return (
    <button
      className={`${style} px-4 py-2 rounded-md text-white`}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default Button;
