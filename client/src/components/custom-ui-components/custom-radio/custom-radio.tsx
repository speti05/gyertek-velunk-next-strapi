"use client";

import React from "react";
import style from "./custom-radio.module.scss";

export interface RadioOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface CustomRadioGroupProps {
  name: string;
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

const CustomRadioGroup: React.FC<CustomRadioGroupProps> = ({
  name,
  options,
  value,
  onChange,
  label,
}) => {
  return (
    <div className={style.group}>
      {label && <span className={style.label}>{label}</span>}
      <div className={style.options} role="radiogroup" aria-label={label}>
        {options.map((option) => {
          const id = `${name}-${option.value}`;
          const isSelected = value === option.value;
          return (
            <div
              key={option.value}
              className={`${style.option}${isSelected ? ` ${style.selected}` : ""}`}
            >
              <input
                type="radio"
                id={id}
                name={name}
                value={option.value}
                checked={isSelected}
                onChange={() => onChange(option.value)}
              />
              <label htmlFor={id}>
                {option.icon && <span className={style.icon}>{option.icon}</span>}
                {option.label}
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CustomRadioGroup;
