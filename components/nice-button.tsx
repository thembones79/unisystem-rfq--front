import { ReactNode, MouseEventHandler } from "react";

import styles from "../styles/NiceButton.module.scss";

interface NiceButtonProps {
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  color?: string;
}

export const NiceButton: React.FC<NiceButtonProps> = ({
  onClick,
  children,
  color,
}) => (
  <button onClick={onClick} className={styles.pushable}>
    <span className={styles.shadow}></span>
    <span className={color ? styles[`edge--${color}`] : styles.edge}></span>
    <span className={color ? styles[`front--${color}`] : styles.front}>
      {children}
    </span>
  </button>
);
