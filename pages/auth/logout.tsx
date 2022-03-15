import React, { useEffect } from "react";
import Router from "next/router";
import { useRequest } from "../../hooks/useRequest";

const Logout = () => {
  const { doRequest } = useRequest({
    url: "/users/logout",
    method: "post",
    body: {},
    onSuccess: () => Router.push("/"),
  });
  useEffect(() => {
    doRequest();
  }, []);

  return <div>Loging you out...</div>;
};

export default Logout;
