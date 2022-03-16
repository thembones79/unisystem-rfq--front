import React, { useEffect } from "react";

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

  return <div>Loging you out...</div>;
};

export default Logout;
