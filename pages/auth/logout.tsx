import React, { useEffect } from "react";
import styles from "../../styles/Home.module.scss";

const Logout = () => {
  const removeJwt = () => {
    localStorage.removeItem("token");
    window.location.replace(
      `${window.location.protocol}//${window.location.hostname}:${window.location.port}`
    );
  };

  useEffect(() => {
    removeJwt();
  }, []);

  return (
    <div className="full-page">
      <div className={styles.wrapper}>
        <p className={styles.floatingTxt}>
          <span className={styles.fat}>⎋ logging you out...</span>
        </p>
      </div>
    </div>
  );
};

export default Logout;
