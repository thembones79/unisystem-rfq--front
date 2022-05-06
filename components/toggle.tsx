import React from "react";
import styles from "../styles/Toggle.module.scss";

export interface ToggleProps {
  handleChange: React.Dispatch<React.SetStateAction<boolean>>;
  label: string;
  fieldname: string;
  initialValue: boolean;
}

export const Toggle: React.FC<ToggleProps> = ({
  handleChange,
  label,
  fieldname,
  initialValue,
}) => {
  return (
    <div className="field m-3">
      <div className={styles.switchHolder}>
        <div className="label">
          <span className={initialValue ? styles.checked : ""}>{label}</span>
        </div>
        <div className={styles.switchToggle}>
          <input
            type="checkbox"
            name={fieldname}
            id={fieldname}
            checked={initialValue}
            onChange={(e) => {
              handleChange(e.target.checked);
            }}
          />
          <label htmlFor={fieldname}></label>
        </div>
      </div>
    </div>
  );
};
